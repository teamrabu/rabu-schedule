package com.teamrabu.schedule.cli;

public class Generator {
	private static final String CONFIG_TAG = "<%=\\s*config\\s*%>";

	private final String template;
	private final String config;

	public Generator(String template, String config) {
		this.template = template;
		this.config = config;
	}

	public String html() {
		if (!template.matches("(?sm).*" + CONFIG_TAG + ".*")) throw new NoConfigTagException();
		return template.replaceAll(CONFIG_TAG, config);
	}
}

class NoConfigTagException extends RuntimeException {
	private static final long serialVersionUID = 1L;
}
