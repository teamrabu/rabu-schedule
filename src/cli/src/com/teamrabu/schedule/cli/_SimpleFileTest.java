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
		rabuFile.save("stuff");
		assertTrue("should exist", rabuFile.exists());
	}

	@Test
	public void delete() throws Exception {
		rabuFile.save("stuff");
		rabuFile.delete();
		assertFalse("should not exist", file.exists());
	}

	@Test
	public void shouldUseCorrectLocation() throws Exception {
		rabuFile.save("stuff");
		assertTrue("should save to correct filename", file.exists());
	}

	@Test
	public void saveAndLoad() throws Exception {
		rabuFile.save("oingo boingo");
		assertEquals("oingo boingo", rabuFile.load());
	}

	@Test
	public void saveAndLoad_worksWithMultipleLines_JavaSucksBecauseItShouldDoThisForMeArghArghArgh() throws Exception {
		rabuFile.save("1\n2\n3\n");
		assertEquals("1\n2\n3\n", rabuFile.load());
	}

	@Test
	public void saveOverwritesExistingFile() throws Exception {
		rabuFile.save("1");
		rabuFile.save("2");
		assertEquals("2", rabuFile.load());
	}
}
