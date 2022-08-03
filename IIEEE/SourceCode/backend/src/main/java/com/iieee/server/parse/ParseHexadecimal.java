package com.iieee.server.parse;

import lombok.Getter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Getter
public class ParseHexadecimal {
    public static List<String> hexToStringList(String hex) {
        String ascii = hexToASCII(hex);
        return new ArrayList<>(Arrays.asList(ascii.split(" ")));
    }

    public static String hexToASCII(String hex) {
        StringBuilder output = new StringBuilder();
        for (int i = 0; i < hex.length(); i += 2)
        {
            String str = hex.substring(i, i + 2);
            output.append((char) Integer.parseInt(str, 16));
        }
        return output.toString();
    }
}
