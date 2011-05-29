// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

package com.teamrabu.schedule.cli;

import static org.junit.Assert.*;
import java.io.*;
import org.junit.*;

public class _SimpleFileTest {

	private File file;
	private SimpleFile rabuFile;

	@Before
	public void setup() throws Exception {
		file = new File("deleteme.testfile");
		rabuFile = new SimpleFile("deleteme.testfile");
	}

	@After
	public void teardown() {
		file.delete();
	}

	@Test
	public void exists() throws Exception {
		assertFalse("should not exist", rabuFile.exists());
		rabuFile.save("stuff", "UTF-8");
		assertTrue("should exist", rabuFile.exists());
	}

	@Test
	public void delete() throws Exception {
		rabuFile.save("stuff", "UTF-8");
		rabuFile.delete();
		assertFalse("should not exist", file.exists());
	}

	@Test
	public void usesCorrectLocation() throws Exception {
		rabuFile.save("stuff", "UTF-8");
		assertTrue("should save to correct filename", file.exists());
	}

	@Test
	public void saveAndLoad() throws Exception {
		rabuFile.save("oingo boingo", "UTF-8");
		assertEquals("oingo boingo", rabuFile.load("UTF-8"));
	}

	@Test
	public void saveAndLoad_worksWithMultipleLines_JavaSucksBecauseItShouldDoThisForMeArghArghArgh() throws Exception {
		rabuFile.save("1\n2\n3\n", "UTF-8");
		assertEquals("1\n2\n3\n", rabuFile.load("UTF-8"));
	}

	@Test
	public void saveAndLoad_obeysCharset() throws Exception {
		rabuFile.save("‘", "UTF-8");
		assertEquals("ÌÇ", rabuFile.load("Latin1"));
	}

	@Test
	public void saveOverwritesExistingFile() throws Exception {
		rabuFile.save("1", "UTF-8");
		rabuFile.save("2", "UTF-8");
		assertEquals("2", rabuFile.load("UTF-8"));
	}
}
