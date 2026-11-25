package au.org.dubboewaste.reuse;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

/** Home screen: launches each offline reuse tool. */
public class LauncherActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_launcher);
        findViewById(R.id.btnClock).setOnClickListener(
                v -> startActivity(new Intent(this, ClockActivity.class)));
        findViewById(R.id.btnCalc).setOnClickListener(
                v -> startActivity(new Intent(this, CalculatorActivity.class)));
        findViewById(R.id.btnStopwatch).setOnClickListener(
                v -> startActivity(new Intent(this, StopwatchActivity.class)));
    }
}
