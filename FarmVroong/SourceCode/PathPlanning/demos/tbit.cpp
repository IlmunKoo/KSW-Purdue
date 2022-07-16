#include <ompl/base/SpaceInformation.h>
#include <ompl/base/objectives/PathLengthOptimizationObjective.h>
//#include <ompl/base/objectives/MaximizeMinClearanceObjective.h>
#include <ompl/base/spaces/RealVectorStateSpace.h>
// For ompl::msg::setLogLevel
#include "ompl/util/Console.h"
#include <ompl/base/objectives/StateCostIntegralObjective.h>

// The supported optimal planners, in alphabetical order
#include <ompl/geometric/planners/informedtrees/BITstar.h>
#include "ompl/geometric/PathGeometric.h"

// For boost program options
#include <boost/program_options.hpp>
// For string comparison (boost::iequals)
#include <boost/algorithm/string.hpp>
// For std::make_shared
#include <memory>

#include <fstream>

#include <boost/filesystem.hpp>
#include <ompl/util/PPM.h>


namespace ob = ompl::base;
namespace og = ompl::geometric;
/// @cond IGNORE
// MUST if load PPM file, replace to RGB Color
class ValidityChecker : public ob::StateValidityChecker
{
public:
    ValidityChecker(const ob::SpaceInformationPtr& si_) :
        ob::StateValidityChecker(si_) {
            //test.warn("warn");
        }

    // Returns whether the given state's position overlaps the
    // circular obstacle
    bool isValid(const ob::State* state) const override
    {
        const int w = std::min((int)state->as<ob::RealVectorStateSpace::StateType>()->values[0], maxWidth_);
        const int h = std::min((int)state->as<ob::RealVectorStateSpace::StateType>()->values[1], maxHeight_);

        const ompl::PPM::Color &c = ppm_.getPixel(h, w);
        
        return c.red > 127 && c.green > 127 && c.blue > 127;        return this->clearance(state) > 0.0;
    }

    // Returns the distance from the given state's position to the
    // boundary of the circular obstacle.
    double clearance(const ob::State* state) const override
    {
        //test.warn("warn");
        // We know we're working with a RealVectorStateSpace in this
        // example, so we downcast state into the specific type.
        const auto* state2D =
            state->as<ob::RealVectorStateSpace::StateType>();

        // Extract the robot's (x,y) position from its state
        double x = state2D->values[0];
        double y = state2D->values[1];

        // Distance formula between two points, offset by the circle's
        // radius
        return sqrt((x-0.5)*(x-0.5) + (y-0.5)*(y-0.5)) - 0.25;
    }
};

// // MUST take the color from SpaceInformation
// class StabilityChecker : public ob::StateStabilityChecker
// {
// public:
//     StabilityChecker(const ob::SpaceInformationPtr& si_) :
//         ob::StateStabilityChecker(si_) {
//         }
    
//     bool isStable(const ob::State* state) const override
//     {
//         return true;
//     }
// };

/** Create an optimization objective which attempts to optimize both
    path length and clearance. We do this by defining our individual
    objectives, then adding them to a MultiOptimizationObjective
    object. This results in an optimization objective where path cost
    is equivalent to adding up each of the individual objectives' path
    costs.

    When adding objectives, we can also optionally specify each
    objective's weighting factor to signify how important it is in
    optimal planning. If no weight is specified, the weight defaults to
    1.0.
*/

/**
 * @brief optimal objective
 */

class ClearanceObjective : public ob::StateCostIntegralObjective
{
public:
    ClearanceObjective(const ob::SpaceInformationPtr& si_) :
        ob::StateCostIntegralObjective(si_, true)
    {
        //test.warn("warn");
    }

    // Our requirement is to maximize path clearance from obstacles,
    // but we want to represent the objective as a path cost
    // minimization. Therefore, we set each state's cost to be the
    // reciprocal of its clearance, so that as state clearance
    // increases, the state cost decreases.
    ob::Cost stateCost(const ob::State* s) const override
    {
        //test.warn("warn");
        return ob::Cost(1 / (si_->getStateValidityChecker()->clearance(s) +
            std::numeric_limits<double>::min()));
    }
};

class tBITEnvironment
{
public:
    tBITEnvironment(const char *ppm_file) //, bool use_deterministic_sampling = false)
    {
        bool ok = false;
        try
        {
            ppm_.loadFile(ppm_file);
            ok = true;
        }
        catch (ompl::Exception &ex)
        {
            OMPL_ERROR("Unable to load %s.\n%s", ppm_file, ex.what());
        }
        if (ok)
        {
            // set space
            auto space(std::make_shared<ob::RealVectorStateSpace>());
            space->addDimension(0.0, ppm_.getWidth());
            space->addDimension(0.0, ppm_.getHeight());
            maxWidth_ = ppm_.getWidth() - 1;
            maxHeight_ = ppm_.getHeight() - 1;
            // Construct a space information instance for this state space
            si_ = std::make_shared<ob::SpaceInformation>(space);

            // set state validity checking for this space
            si_->setStateValidityChecker(std::make_shared<ValidityChecker>(si_));
            si_->setup();

            // set problem definition
            pdef_ = std::make_shared<ob::ProblemDefinition>(si_);

            // set Optimization Objective 
            // st 
            auto lengthObj(std::make_shared<ob::PathLengthOptimizationObjective>(si_));
            auto clearObj(std::make_shared<ClearanceObjective>(si_));
            auto opt(std::make_shared<ob::MultiOptimizationObjective>(si_));
            opt->addObjective(lengthObj, 10.0);
            opt->addObjective(clearObj, 1.0);
            pdef_->setOptimizationObjective(getBalancedObjective(si_));

            //set planner
            optimizingPlanner_ = std::make_shared<og::BITstar>(si_);
            // Set the problem instance for our planner to solve
            optimizingPlanner_->setProblemDefinition(pdef_);
            optimizingPlanner_->setup();
        }
    }

    bool plan(unsigned int start_row, unsigned int start_col, unsigned int goal_row, unsigned int goal_col)
    {
        ob::StateSpacePtr space = si_->getStateSpace();
        // Set our robot's starting state to be the bottom-left corner of
        // the environment, or (0,0).
        // MUST input and output from command argv
        ob::ScopedState<> start(space);
        start->as<ob::RealVectorStateSpace::StateType>()->values[0] = start_row; //0.0
        start->as<ob::RealVectorStateSpace::StateType>()->values[1] = start_col; //0.0

        // Set our robot's goal state to be the top-right corner of the
        // environment, or (1,1).
        ob::ScopedState<> goal(space);
        goal->as<ob::RealVectorStateSpace::StateType>()->values[0] = goal_row;//1.0;
        goal->as<ob::RealVectorStateSpace::StateType>()->values[1] = goal_col;//1.0;

        // Set the start and goal states
        pdef_->setStartAndGoalStates(start, goal);

        // attempt to solve the planning problem in the given runtime
        ob::PlannerStatus solved = optimizingPlanner_->solve(10);

        if (solved)
        {
            // Output the length of the path found
            std::cout
                << optimizingPlanner_->getName()
                << " found a solution of length "
                << pdef_->getSolutionPath()->length()
                << std::endl;

            // If a filename was specified, output the path as a matrix to
            // that file for visualization
            // if (!outputFile.empty())
            // {
            //     std::ofstream outFile(outputFile.c_str());
            //     std::static_pointer_cast<og::PathGeometric>(pdef_->getSolutionPath())->
            //         printAsMatrix(outFile);
            //     outFile.close();
            // }
            return true;
        }
        else
        {
            std::cout << "No solution found." << std::endl;
            return false;
        }
    }

    void recordSolution()
    {
        if (!pdef_ || !pdef_->hasSolution())
            return;
        const ob::PathPtr &pp = pdef_->getSolutionPath();
        //if (pp)
        og::PathGeometric &p = static_cast<og::PathGeometric &>(*pp);
        p.interpolate();
        for (std::size_t i = 0; i < p.getStateCount(); ++i)
        {
            const int w = std::min(maxWidth_, (int)p.getState(i)->as<ob::RealVectorStateSpace::StateType>()->values[0]);
            const int h =
                std::min(maxHeight_, (int)p.getState(i)->as<ob::RealVectorStateSpace::StateType>()->values[1]);
            ompl::PPM::Color &c = ppm_.getPixel(h, w);
            c.red = 255;
            c.green = 0;
            c.blue = 0;
        }
    }

    void save(const char *filename)
    {
        if (!pdef_)
            return
        ppm_.saveFile(filename);
    }

    ob::OptimizationObjectivePtr getBalancedObjective(const ob::SpaceInformationPtr& si_)
    {
        //test.warn("warn");
        auto lengthObj(std::make_shared<ob::PathLengthOptimizationObjective>(si_));
        auto clearObj(std::make_shared<ClearanceObjective>(si_));
        auto opt(std::make_shared<ob::MultiOptimizationObjective>(si_));
        opt->addObjective(lengthObj, 10.0);
        opt->addObjective(clearObj, 1.0);

        return ob::OptimizationObjectivePtr(opt);
    }

private:
    ob::ProblemDefinitionPtr pdef_;
    ob::SpaceInformationPtr si_;
    ob::PlannerPtr optimizingPlanner_;
    int maxWidth_;
    int maxHeight_;
    ompl::PPM ppm_;
};
// Parse the command-line arguments
/** Parse the command line arguments into a string for an output file and the planner/optimization types */
// MUST add start and goal
    // START is current state
    // GOAL is arg INPUT


int main(int argc, char** argv)
{
    // The parsed arguments
    std::string outputFile = argv[1];
    unsigned int start_row = std::stoul(argv[2],nullptr,16);
    unsigned int start_col = std::stoul(argv[3],nullptr,16);
    unsigned int goal_row = std::stoul(argv[4],nullptr,16);
    unsigned int goal_col = std::stoul(argv[5],nullptr,16);

    ompl::msg::setLogLevel(ompl::msg::LOG_DEBUG);

    boost::filesystem::path path(TEST_RESOURCES_DIR);
    tBITEnvironment env((path / "ppm/floor.ppm").string().c_str());
        // MUST add start and goal
    if (env.plan(start_row, start_col, goal_row, goal_col))
    {
        env.recordSolution();
        env.save((outputFile+".ppm").c_str());
        // Return with success
        return 0;
    }
    // Return with error
    return -1;
}
/// @endcond
