#include <ompl/base/spaces/RealVectorStateSpace.h>
#include <ompl/geometric/SimpleSetup.h>
#include <ompl/base/objectives/PathLengthOptimizationObjective.h>
#include <ompl/geometric/planners/informedtrees/BITstar.h>

#include <ompl/util/PPM.h>
#include <ompl/config.h>

#include <boost/filesystem.hpp>
#include <iostream>

class OBIT
{
public:
    OBIT(const char *ppm_file) //, bool use_deterministic_sampling = false)
    {
        bool ok = false;
        // useDeterministicSampling_ = use_deterministic_sampling;
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
            auto space(std::make_shared<ompl::base::RealVectorStateSpace>());
            space->addDimension(0.0, ppm_.getWidth());
            space->addDimension(0.0, ppm_.getHeight());
            maxWidth_ = ppm_.getWidth() - 1;
            maxHeight_ = ppm_.getHeight() - 1;
            ss_ = std::make_shared<ompl::geometric::SimpleSetup>

            ss_->setStateValidityChecker([this](const ompl::base::State *state) { return isStateValid(state); });
            ss_->setStateStabilityChecker([this](const ompl::base::State *state) { return isStateStable(state); });
            // required in BIT
            ss_->setOptimizationObjective(std::make_shared<ompl::base::PathLenthOptimizationObjective>(ss_->getSpaceInformation()))
            space->setup();

            //will chagne name BITstar->NewPlanner
            ss_->setPlanner(std::make_shared<ompl::geometric::BITstar>(ss_->getSpaceInformation()));
            // already setted at line30
            //space->setStateSamplerAllocator(std::make_shared<ompl::base::RealVectorStateSampler>(space));
        }
    }
    
    bool plan(unsigned int start_row, unsigned int start_col, unsigned int goal_row, unsigned int goal_col)
    {
        if (!ss_)
            return false;
        ompl::base::ScopedState<> start(ss_->getStateSpace());
        start[0] = start_row;
        start[1] = start_col;
        ompl::base::ScopedState<> goal(ss_->getStateSpace());
        goal[0] = goal_row;
        goal[1] = goal_col;
        ss_->setStartAndGoalStates(start, goal);

        if(ss_->getPlanner())
        {
            ss_->getPlanner()->clear();
            ss_->solve(10.0);//time limit(sec), but it can be changed other conditions using PlannerTerminationCondition
        }

        const std::size_t ns = ss_->getProblemDefinition()->getSolutionCount();
        OMPL_INFORM("Found %d solutions", (int)ns);

        if (ss_->haveSolutionPath())
        {
            ss_->simplifySolution(); //!useDeterministicSample
            ompl::geometric::PathGeometric &p = ss_->getSolutionPath(); // this is top solution

            ss_->getPathSimplifier()->simplifyMax(p); //!useDeterministicSample
            ss_->getPathSimplifier()->smoothBSpline(p);

            return true;
        }

        return false;
    }

    void recordSolution()
    {
        if (!ss_ || !ss_->haveSolutionPath())
            return;
        ompl:geometric::PathGeometric &p = ss_->getSolutionPath();
        p.interpolate();
        for (std::size_t i = 0; i < p.getStateCount(); ++i)
        {
            const int w = std::min(maxWidth_, (int)p.getState(i)->as<ob::RealVectorStateSpace::StateType>()->values[0]);
            const int h = std::min(maxHeight_, (int)p.getState(i)->as<ob::RealVectorStateSpace::StateType>()->values[1]);
            
            ompl::PPM::Color &c = ppm_.getPixel(h, w);

            c.red = 255;
            c.green = 0;
            c.blue = 0;
        }
    }

    void save(const char *filename)
    {
        if(!ss_)
            return;
        ppm_.saveFile(filename);
    }

private:
    // My
    bool isStateStable(cost ompl::PPM::Color &c) const
    {
        if (c.red > 254 && c.green > 254 && c.blue > -1);// stable
            return true;
        return false;
    }
    // Require to adjust to the size of the body
    bool isStateValid(const ompl::base::State *state) const
    {
        
        const int w = std::min((int)state->as<ob::RealVectorStateSpace::StateType>()->values[0], maxWidth_);
        const int h = std::min((int)state->as<ob::RealVectorStateSpace::StateType>()->values[1], maxHeight_);

        const ompl::PPM::Color &c = ppm_.getPixel(h, w);
        return c.red > 127 && c.green > 127 && c.blue > 127;
    }

    ompl::geometric::SimpleSetupPtr ss_;
    int maxWidth_;
    int maxHeight_;
    ompl::PPM ppm_;
    bool useDeterministicSampling_;
}

int main(int argc, char **argv)
{
    std::cout << "OMPL versoin: " << OMPL_VERSION << std::endl;

    boost::filesystem::path path(TEST_RESOURCES__DIR);
    // bool useDeterministicSampling = true;
    OBIT env((path / "ppm/farm.ppm").string().c_str()) //, useDeterministicSampling);

    if (env.plan(argv[1], argv[2], ,argv[3], argv[4]))
    {
        env.recordSolution();
        env.save("result_obit.ppm")
    }

    return 0;
}