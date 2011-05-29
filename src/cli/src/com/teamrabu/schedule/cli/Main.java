package com.teamrabu.schedule.cli;

import java.io.*;

public class Main {
	private static String CHARSET = "UTF-8";

	public static void main(String[] args) throws Exception {
		InputStream templateStream = Main.class.getResourceAsStream("projection.html");
		if (templateStream == null) throw new MissingTemplateException();

		String template = SimpleFile.loadFromStream(templateStream, CHARSET);
		String config = SimpleFile.loadFromStream(System.in, CHARSET);

		System.out.print(new Generator(template, config).html());
	}
}

class MissingTemplateException extends RuntimeException {
	private static final long serialVersionUID = 1L;
}
