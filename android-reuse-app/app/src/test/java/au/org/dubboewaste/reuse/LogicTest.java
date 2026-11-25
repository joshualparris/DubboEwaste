package au.org.dubboewaste.reuse;

import static org.junit.Assert.*;
import org.junit.Test;

public class LogicTest {
    @Test public void photoTypes() {
        assertTrue(PhotoFrameLogic.isPhoto("image/jpeg"));
        assertTrue(PhotoFrameLogic.isPhoto("image/png"));
        assertFalse(PhotoFrameLogic.isPhoto("video/mp4"));
        assertFalse(PhotoFrameLogic.isPhoto(null));
    }
    @Test public void slideshowWraps() {
        assertEquals(0, PhotoFrameLogic.nextIndex(-1, 3));
        assertEquals(2, PhotoFrameLogic.nextIndex(1, 3));
        assertEquals(0, PhotoFrameLogic.nextIndex(2, 3));
        assertEquals(-1, PhotoFrameLogic.nextIndex(0, 0));
    }
    @Test public void timeFormat() {
        assertEquals("0:00", AudioLogic.time(0));
        assertEquals("3:07", AudioLogic.time(187_000));
        assertEquals("1:02:03", AudioLogic.time(3_723_000));
    }
    @Test public void songsAlwaysStartAtBeginning() {
        assertEquals(0, AudioLogic.resumeAt(4 * 60_000, 120_000));
    }
    @Test public void audiobookResumesWithRewind() {
        assertEquals(595_000, AudioLogic.resumeAt(3_600_000, 600_000));
    }
    @Test public void finishedAudiobookStartsAgain() {
        assertEquals(0, AudioLogic.resumeAt(3_600_000, 3_599_000));
        assertEquals(0, AudioLogic.resumeAt(3_600_000, -1));
    }
}
