// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

package com.teamrabu.schedule.cli;

import static org.junit.Assert.*;
import org.junit.*;

public class _GeneratorTest {

	@Test
	public void interpolates() {
		assertEquals("standard", "a\ninterpolated config\nb", new Generator("a\n<%= config %>\nb", "interpolated config").html());
		assertEquals("no whitespace", "a", new Generator("<%=config%>", "a").html());
		assertEquals("extra whitespace", "b", new Generator("<%=   config   %>", "b").html());
		assertEquals("multiple tags", "abcabc", new Generator("<%=config%><%=config%>", "abc").html());
		assertEquals("non-ascii", "‘ŠŸ", new Generator("‘<%=config%>Ÿ", "Š").html());
	}

	@Test(expected = NoConfigTagException.class)
	public void throwsExceptionWhenTagMissing() {
		new Generator("should throw exception", "").html();
	}
}
