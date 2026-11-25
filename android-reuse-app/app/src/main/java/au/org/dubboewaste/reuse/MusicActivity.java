package au.org.dubboewaste.reuse;

import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.provider.OpenableColumns;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import java.util.ArrayList;
import java.util.List;

/**
 * Music and audiobook player for files the owner chooses with the system file picker
 * (no storage permission). Long files are treated as audiobooks: the position is saved
 * and resumed, rewinding five seconds.
 */
public class MusicActivity extends AppCompatActivity {
    private static final int PICK_AUDIO = 2;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private final List<Uri> queue = new ArrayList<>();
    private MediaPlayer player;
    private int track = -1;
    private TextView title, progress;
    private Button playPause;
    private SharedPreferences prefs;

    private final Runnable tick = new Runnable() {
        @Override public void run() {
            if (player != null) {
                progress.setText(AudioLogic.time(player.getCurrentPosition()) + " / " + AudioLogic.time(player.getDuration()));
                if (player.isPlaying()) prefs.edit().putInt(key(), player.getCurrentPosition()).apply();
            }
            handler.postDelayed(this, 1000);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        prefs = getSharedPreferences("music", MODE_PRIVATE);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER);
        root.setPadding(48, 48, 48, 48);
        title = text(getString(R.string.music_choose), 22);
        progress = text("", 18);
        Button choose = button(getString(R.string.music_pick), v -> pick());
        Button back = button(getString(R.string.music_back), v -> seek(-30_000));
        playPause = button(getString(R.string.music_play), v -> toggle());
        Button forward = button(getString(R.string.music_forward), v -> seek(30_000));
        Button nextBtn = button(getString(R.string.music_next), v -> play(track + 1));
        for (android.view.View v : new android.view.View[]{title, progress, playPause, back, forward, nextBtn, choose}) root.addView(v);
        setContentView(root);
        handler.post(tick);
    }

    private TextView text(String s, int sp) {
        TextView t = new TextView(this); t.setText(s); t.setTextSize(sp); t.setGravity(Gravity.CENTER);
        t.setPadding(0, 8, 0, 24); return t;
    }

    private Button button(String label, android.view.View.OnClickListener l) {
        Button b = new Button(this); b.setText(label); b.setTextSize(20); b.setOnClickListener(l);
        b.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        return b;
    }

    private void pick() {
        Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("audio/*");
        i.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
        try { startActivityForResult(i, PICK_AUDIO); }
        catch (android.content.ActivityNotFoundException e) { title.setText(R.string.photo_no_picker); }
    }

    @Override
    protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request != PICK_AUDIO || result != RESULT_OK || data == null) return;
        queue.clear();
        if (data.getClipData() != null) {
            for (int i = 0; i < data.getClipData().getItemCount(); i++) queue.add(data.getClipData().getItemAt(i).getUri());
        } else if (data.getData() != null) queue.add(data.getData());
        play(0);
    }

    private String key() { return track >= 0 && track < queue.size() ? "pos:" + queue.get(track) : "none"; }

    private void play(int i) {
        if (queue.isEmpty()) { pick(); return; }
        release();
        track = i % queue.size();
        try {
            player = new MediaPlayer();
            player.setDataSource(this, queue.get(track));
            player.prepare();
            player.seekTo(AudioLogic.resumeAt(player.getDuration(), prefs.getInt(key(), -1)));
            player.setOnCompletionListener(mp -> { prefs.edit().remove(key()).apply(); play(track + 1); });
            player.start();
            title.setText(name(queue.get(track)));
            playPause.setText(R.string.music_pause);
        } catch (Exception e) {
            title.setText(getString(R.string.music_cannot_play, name(queue.get(track))));
        }
    }

    private String name(Uri uri) {
        try (Cursor c = getContentResolver().query(uri, new String[]{OpenableColumns.DISPLAY_NAME}, null, null, null)) {
            if (c != null && c.moveToFirst()) return c.getString(0);
        } catch (RuntimeException ignored) { }
        return uri.getLastPathSegment();
    }

    private void toggle() {
        if (player == null) { play(Math.max(0, track)); return; }
        if (player.isPlaying()) { player.pause(); playPause.setText(R.string.music_play); }
        else { player.start(); playPause.setText(R.string.music_pause); }
    }

    private void seek(int deltaMs) {
        if (player != null) player.seekTo(Math.max(0, Math.min(player.getDuration(), player.getCurrentPosition() + deltaMs)));
    }

    private void release() {
        if (player != null) { prefs.edit().putInt(key(), player.getCurrentPosition()).apply(); player.release(); player = null; }
    }

    @Override protected void onDestroy() { super.onDestroy(); handler.removeCallbacks(tick); release(); }
}
