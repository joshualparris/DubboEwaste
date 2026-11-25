package au.org.dubboewaste.reuse;

import java.util.Locale;

/** Pure player rules (time display and audiobook resume), unit-tested without Android. */
final class AudioLogic {
    private AudioLogic() {}
    /** Files shorter than this are treated as songs and always start from the beginning. */
    static final int AUDIOBOOK_MIN_MS = 10 * 60 * 1000;
    /** Rewind a little when resuming so the listener catches the last sentence again. */
    static final int RESUME_REWIND_MS = 5_000;

    static String time(int ms) {
        int s = Math.max(0, ms) / 1000;
        return s >= 3600 ? String.format(Locale.ROOT, "%d:%02d:%02d", s / 3600, s / 60 % 60, s % 60)
                         : String.format(Locale.ROOT, "%d:%02d", s / 60, s % 60);
    }

    /** Where to start a file, given its length and the saved position (or -1 if none). */
    static int resumeAt(int durationMs, int savedMs) {
        if (durationMs < AUDIOBOOK_MIN_MS || savedMs <= 0) return 0;
        if (savedMs >= durationMs - RESUME_REWIND_MS) return 0; // finished: start again
        return Math.max(0, savedMs - RESUME_REWIND_MS);
    }
}
