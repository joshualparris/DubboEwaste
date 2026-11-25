package au.org.dubboewaste.reuse;

import android.os.Bundle;
import android.view.Gravity;
import android.widget.Button;
import android.widget.GridLayout;
import android.widget.LinearLayout;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

/** Simple, reliable two-operand calculator built programmatically. */
public class CalculatorActivity extends AppCompatActivity {
    private double acc = 0;
    private String pendingOp = null;
    private boolean fresh = true;
    private TextView display;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);

        display = new TextView(this);
        display.setText("0");
        display.setTextSize(40);
        display.setGravity(Gravity.END);
        display.setPadding(32, 64, 32, 32);
        root.addView(display, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT));

        GridLayout grid = new GridLayout(this);
        grid.setColumnCount(4);
        String[] keys = {"7", "8", "9", "/", "4", "5", "6", "*",
                "1", "2", "3", "-", "0", "C", "=", "+"};
        for (String key : keys) {
            Button btn = new Button(this);
            btn.setText(key);
            btn.setTextSize(22);
            GridLayout.LayoutParams lp = new GridLayout.LayoutParams();
            lp.width = 0;
            lp.columnSpec = GridLayout.spec(GridLayout.UNDEFINED, 1, 1f);
            lp.setGravity(Gravity.FILL);
            btn.setLayoutParams(lp);
            btn.setOnClickListener(v -> onKey(key));
            grid.addView(btn);
        }
        root.addView(grid, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT));
        setContentView(root);
    }

    private void onKey(String key) {
        switch (key) {
            case "C":
                acc = 0;
                pendingOp = null;
                fresh = true;
                display.setText("0");
                return;
            case "+":
            case "-":
            case "*":
            case "/":
                applyPending();
                pendingOp = key;
                fresh = true;
                return;
            case "=":
                applyPending();
                pendingOp = null;
                fresh = true;
                return;
            default:
                if (fresh) {
                    display.setText(key);
                    fresh = false;
                } else {
                    display.setText(display.getText().toString() + key);
                }
        }
    }

    private void applyPending() {
        double cur = parse(display.getText().toString());
        if (pendingOp == null) {
            acc = cur;
        } else {
            switch (pendingOp) {
                case "+": acc = acc + cur; break;
                case "-": acc = acc - cur; break;
                case "*": acc = acc * cur; break;
                case "/": acc = (cur == 0) ? 0 : acc / cur; break;
                default: break;
            }
        }
        display.setText(format(acc));
        fresh = true;
    }

    private double parse(String s) {
        try {
            return Double.parseDouble(s);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private String format(double d) {
        if (!Double.isInfinite(d) && !Double.isNaN(d) && d == Math.rint(d)) {
            return String.valueOf((long) d);
        }
        return String.valueOf(d);
    }
}
