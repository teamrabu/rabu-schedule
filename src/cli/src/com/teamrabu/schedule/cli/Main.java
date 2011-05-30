package com.teamrabu.schedule.cli;

import java.io.*;

public class Main {
	private static String CHARSET = "UTF-8";

	public static void main(String[] args) throws Exception {
		if (args.length == 0) {
			process();
			System.exit(0);
		}
		else {
			usage();
			System.exit(1);
		}
	}

	private static void process() throws UnsupportedEncodingException, IOException {
		String template = loadResource("projection.html");
		String config = SimpleFile.loadFromStream(System.in, CHARSET);

		String output = new Generator(template, config).html();
		SimpleFile.writeToStream(System.out, output, CHARSET);
	}

	private static void usage() throws UnsupportedEncodingException, IOException {
		String usage = loadResource("usage.txt");
		System.err.print(usage);
	}

	private static String loadResource(String name) throws UnsupportedEncodingException, IOException {
		InputStream templateStream = Main.class.getResourceAsStream("resources/" + name);
		if (templateStream == null) throw new MissingResourceException(name);
		return SimpleFile.loadFromStream(templateStream, CHARSET);
	}
}

class MissingResourceException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public MissingResourceException(String resourceName) {
		super("Required resource not found: " + resourceName);
	}
}
