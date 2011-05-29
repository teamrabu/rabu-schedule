package com.teamrabu.schedule.cli;

import java.io.*;

public class SimpleFile {
	private File file;

	public SimpleFile(String name) {
		file = new File(name);
	}

	public void save(String text, String charset) throws IOException {
		Writer output = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file), charset));
		try {
			output.write(text);
		}
		finally {
			output.close();
		}
	}

	public String load(String charset) throws IOException {
		BufferedReader input = new BufferedReader(new InputStreamReader(new FileInputStream(file), charset));
		try {
			StringBuilder result = new StringBuilder();
			char[] charBuffer = new char[8192];
			int numberRead;
			while ((numberRead = input.read(charBuffer)) != -1) {
				result.append(charBuffer, 0, numberRead);
			}
			return result.toString();
		}
		finally {
			input.close();
		}
	}

	public boolean exists() {
		return file.exists();
	}

	public void delete() {
		file.delete();
	}

}
