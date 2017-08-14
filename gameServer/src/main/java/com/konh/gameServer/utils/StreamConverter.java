package com.konh.gameServer.utils;

import java.util.stream.Stream;
import java.util.stream.StreamSupport;

public class StreamConverter {
	public static <T> Stream<T> streamOf(final Iterable<T> iterable) {
		return toStream(iterable, false);
	}

	public static <T> Stream<T> parallelStreamOf(final Iterable<T> iterable) {
		return toStream(iterable, true);
	}

	private static <T> Stream<T> toStream(final Iterable<T> iterable, final boolean isParallel) {
		return StreamSupport.stream(iterable.spliterator(), isParallel);
	}
}
