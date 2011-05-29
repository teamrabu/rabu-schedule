package com.teamrabu.schedule.cli;

public class Main {
	private static String CHARSET = "UTF-8";

	public static void main(String[] args) throws Exception {
		String template = SimpleFile.loadFromStream(Main.class.getResourceAsStream("projection.html"), CHARSET);
		String config = SimpleFile.loadFromStream(System.in, CHARSET);

		System.out.print(new Generator(template, config).html());
	}
}
