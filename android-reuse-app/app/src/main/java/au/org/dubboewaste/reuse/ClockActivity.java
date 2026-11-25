package au.org.dubboewaste.reuse;

import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.view.WindowManager;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/** Full-screen bedside clock. Keeps the screen on while visible. */
public class ClockActivity extends AppCompatActivity {
    private final Handler handler = new Handler(Looper.getMainLooper());
    private final SimpleDateFormat fmt = new SimpleDateFormat("HH:mm:ss", Locale.getDefault());
    private TextView clock;

    private final Runnable tick = new Runnable() {
        @Override
        public void run() {
            clock.setText(fmt.format(new Date()));
            handler.postDelayed(this, 1000);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        clock = new TextView(this);
        clock.setGravity(Gravity.CENTER);
        clock.setTextSize(72);
        clock.setTextColor(Color.WHITE);
        clock.setBackgroundColor(Color.BLACK);
        setContentView(clock);
    }

    @Override
    protected void onResume() {
        super.onResume();
        handler.post(tick);
    }

    @Override
    protected void onPause() {
        super.onPause();
        handler.removeCallbacks(tick);
    }
}
