package au.org.dubboewaste.reuse;

import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.provider.DocumentsContract;
import android.view.Gravity;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Digital photo frame. The owner picks a folder once with the system folder picker
 * (Storage Access Framework), so no storage permission is requested. Photos change every
 * 10 seconds and the screen stays on. Tap to show the next photo; long-press to choose
 * another folder.
 */
public class PhotoFrameActivity extends AppCompatActivity {
    static final String PREFS = "photo_frame";
    private static final int PICK_FOLDER = 1;
    private static final long DELAY_MS = 10_000;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private final List<Uri> photos = new ArrayList<>();
    private ImageView view;
    private int index;

    private final Runnable next = new Runnable() {
        @Override public void run() { showNext(); handler.postDelayed(this, DELAY_MS); }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        view = new ImageView(this);
        view.setBackgroundColor(Color.BLACK);
        view.setScaleType(ImageView.ScaleType.FIT_CENTER);
        view.setContentDescription(getString(R.string.mode_photo_frame));
        view.setOnClickListener(v -> { handler.removeCallbacks(next); next.run(); });
        view.setOnLongClickListener(v -> { pickFolder(); return true; });
        setContentView(view);
        String saved = getSharedPreferences(PREFS, MODE_PRIVATE).getString("tree", null);
        if (saved == null || !load(Uri.parse(saved))) pickFolder();
    }

    private void pickFolder() {
        Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
        try { startActivityForResult(i, PICK_FOLDER); }
        catch (android.content.ActivityNotFoundException e) { message(getString(R.string.photo_no_picker)); }
    }

    @Override
    protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request != PICK_FOLDER) return;
        if (result != RESULT_OK || data == null || data.getData() == null) {
            if (photos.isEmpty()) message(getString(R.string.photo_choose_folder));
            return;
        }
        Uri tree = data.getData();
        getContentResolver().takePersistableUriPermission(tree, Intent.FLAG_GRANT_READ_URI_PERMISSION);
        SharedPreferences.Editor e = getSharedPreferences(PREFS, MODE_PRIVATE).edit();
        e.putString("tree", tree.toString()).apply();
        if (!load(tree)) message(getString(R.string.photo_none_found));
    }

    /** Lists image files directly inside the chosen folder. Returns false if none are found. */
    private boolean load(Uri tree) {
        photos.clear();
        try {
            Uri children = DocumentsContract.buildChildDocumentsUriUsingTree(tree, DocumentsContract.getTreeDocumentId(tree));
            try (Cursor c = getContentResolver().query(children, new String[]{
                    DocumentsContract.Document.COLUMN_DOCUMENT_ID, DocumentsContract.Document.COLUMN_MIME_TYPE}, null, null, null)) {
                while (c != null && c.moveToNext()) {
                    String mime = c.getString(1);
                    if (PhotoFrameLogic.isPhoto(mime)) photos.add(DocumentsContract.buildDocumentUriUsingTree(tree, c.getString(0)));
                }
            }
        } catch (RuntimeException ex) { return false; }
        if (photos.isEmpty()) return false;
        Collections.shuffle(photos);
        index = -1;
        handler.removeCallbacks(next);
        next.run();
        return true;
    }

    private void showNext() {
        if (photos.isEmpty()) return;
        index = PhotoFrameLogic.nextIndex(index, photos.size());
        try (InputStream in = getContentResolver().openInputStream(photos.get(index))) {
            BitmapFactory.Options o = new BitmapFactory.Options();
            o.inSampleSize = 2; // halve memory use: old phones have small screens and little RAM
            Bitmap b = BitmapFactory.decodeStream(in, null, o);
            if (b != null) view.setImageBitmap(b);
        } catch (Exception ignored) {
            // An unreadable or removed file is skipped on the next tick.
        }
    }

    private void message(String text) {
        TextView t = new TextView(this);
        t.setText(text);
        t.setTextSize(22);
        t.setGravity(Gravity.CENTER);
        t.setPadding(48, 48, 48, 48);
        t.setTextColor(Color.WHITE);
        t.setBackgroundColor(Color.BLACK);
        t.setOnClickListener(v -> pickFolder());
        setContentView(t);
    }

    @Override protected void onPause() { super.onPause(); handler.removeCallbacks(next); }
    @Override protected void onResume() { super.onResume(); if (!photos.isEmpty()) handler.postDelayed(next, DELAY_MS); }
}
