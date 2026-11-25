package au.org.dubboewaste.reuse;

/** Pure photo-frame rules, kept free of Android types so they can be unit-tested. */
final class PhotoFrameLogic {
    private PhotoFrameLogic() {}

    static boolean isPhoto(String mime) {
        return mime != null && (mime.equals("image/jpeg") || mime.equals("image/png") || mime.equals("image/webp")
                || mime.equals("image/gif") || mime.equals("image/bmp"));
    }

    static int nextIndex(int current, int count) {
        if (count <= 0) return -1;
        return (current + 1 + count) % count;
    }
}
