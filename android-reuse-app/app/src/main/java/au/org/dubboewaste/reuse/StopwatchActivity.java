package au.org.dubboewaste.reuse;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.view.Gravity;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import java.util.Locale;

/** Stopwatch with start/stop/reset, accurate across pause/resume. */
public class StopwatchActivity extends AppCompatActivity {
    private final Handler handler = new Handler(Looper.getMainLooper());
    private long startTime = 0;
    private long elapsed = 0;
    private boolean running = false;
    private TextView display;
    private Button startStop;

    private final Runnable tick = new Runnable() {
        @Override
        public void run() {
            long total = elapsed + (running ? SystemClock.elapsedRealtime() - startTime : 0);
            display.setText(format(total));
            if (running) {
                handler.postDelayed(this, 50);
            }
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER);

        display = new TextView(this);
        display.setText(format(0));
        display.setTextSize(56);
        display.setGravity(Gravity.CENTER);
        display.setPadding(24, 24, 24, 48);
        root.addView(display);

        startStop = new Button(this);
        startStop.setText("Start");
        startStop.setOnClickListener(v -> toggle());
        root.addView(startStop);

        Button reset = new Button(this);
        reset.setText("Reset");
        reset.setOnClickListener(v -> reset());
        root.addView(reset);

        setContentView(root);
    }

    private void toggle() {
        if (running) {
            elapsed += SystemClock.elapsedRealtime() - startTime;
            running = false;
            startStop.setText("Start");
            handler.removeCallbacks(tick);
            display.setText(format(elapsed));
        } else {
            startTime = SystemClock.elapsedRealtime();
            running = true;
            startStop.setText("Stop");
            handler.post(tick);
        }
    }

    private void reset() {
        running = false;
        elapsed = 0;
        startTime = 0;
        handler.removeCallbacks(tick);
        startStop.setText("Start");
        display.setText(format(0));
    }

    private String format(long ms) {
        long totalSeconds = ms / 1000;
        long minutes = totalSeconds / 60;
        long seconds = totalSeconds % 60;
        long centis = (ms % 1000) / 10;
        return String.format(Locale.getDefault(), "%02d:%02d.%02d", minutes, seconds, centis);
    }

    @Override
    protected void onPause() {
        super.onPause();
        handler.removeCallbacks(tick);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (running) {
            handler.post(tick);
        }
    }
}
