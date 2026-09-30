using System; using System.IO; using System.Linq; using System.Collections.Generic; using System.Globalization;
using System.Windows; using System.Windows.Media; using System.Windows.Media.Imaging;

public class Concept { public string Id, Img, Kicker, Plain, Italic, Sub, Cta; public double Fx = 0.5, Fy = 0.5; public bool Full; }

public static class Ads {
  static string R = @"C:\Users\JENIFFER\Downloads\aura-flowers-web\";
  static Dictionary<string, BitmapImage> cache = new Dictionary<string, BitmapImage>();
  static BitmapImage Img(string p) {
    if (!cache.ContainsKey(p)) { var b = new BitmapImage(); b.BeginInit(); b.UriSource = new Uri(R + p); b.CacheOption = BitmapCacheOption.OnLoad; b.EndInit(); b.Freeze(); cache[p] = b; }
    return cache[p];
  }
  static SolidColorBrush B(string h) { var b = new SolidColorBrush((Color)ColorConverter.ConvertFromString(h)); b.Freeze(); return b; }
  static Brush IVORY = B("#F8F4ED"), INK = B("#241D1A"), INK2 = B("#4A403A"), GOLD = B("#A8823A"), LIGHTGOLD = B("#F3DFB4"), WHITE = B("#FFFDF9");
  static Typeface Serif = new Typeface(new FontFamily("Garamond"), FontStyles.Normal, FontWeights.Normal, FontStretches.Normal);
  static Typeface Sans = new Typeface(new FontFamily("Century Gothic"), FontStyles.Normal, FontWeights.Normal, FontStretches.Normal);
  static string Track(string s) { return string.Join("\u200A", s.ToCharArray().Select(ch => ch.ToString())); }
  static FormattedText FT(string t, Typeface tf, double size, Brush br, double maxW, TextAlignment al) {
    var f = new FormattedText(t, CultureInfo.GetCultureInfo("es-ES"), FlowDirection.LeftToRight, tf, size, br, 1.0);
    f.MaxTextWidth = maxW; f.TextAlignment = al; return f;
  }
  static FormattedText Headline(Concept c, double size, Brush br, Brush it, double maxW, TextAlignment al) {
    string t = c.Plain + " " + c.Italic; var f = FT(t, Serif, size, br, maxW, al); f.LineHeight = size * 1.04;
    f.SetFontStyle(FontStyles.Italic, c.Plain.Length + 1, c.Italic.Length); f.SetForegroundBrush(it, c.Plain.Length + 1, c.Italic.Length); return f;
  }
  static void Cover(DrawingContext dc, BitmapSource im, Rect r, Geometry clip, double fx, double fy) {
    double s = Math.Max(r.Width / im.PixelWidth, r.Height / im.PixelHeight); double w = im.PixelWidth * s, h = im.PixelHeight * s;
    double x = r.X - (w - r.Width) * fx, y = r.Y - (h - r.Height) * fy;
    dc.PushClip(clip ?? new RectangleGeometry(r)); dc.DrawImage(im, new Rect(x, y, w, h)); dc.Pop();
  }
  static Geometry Arch(Rect r) {
    var e = new EllipseGeometry(new Point(r.X + r.Width / 2, r.Y + r.Width / 2), r.Width / 2, r.Width / 2);
    var rc = new RectangleGeometry(new Rect(r.X, r.Y + r.Width / 2, r.Width, Math.Max(1, r.Height - r.Width / 2)));
    return new CombinedGeometry(GeometryCombineMode.Union, e, rc);
  }
  static void Pill(DrawingContext dc, string text, double cx, double y, double size, Brush bg, Brush fg, bool left, double lx) {
    var f = FT(Track(text.ToUpper()), Sans, size, fg, 10000, TextAlignment.Left);
    double pw = f.WidthIncludingTrailingWhitespace + size * 3.4, ph = size * 3.4, x = left ? lx : cx - pw / 2;
    dc.DrawRoundedRectangle(bg, null, new Rect(x, y, pw, ph), 2, 2); dc.DrawText(f, new Point(x + size * 1.7, y + (ph - f.Height) / 2));
  }
  static void Logo(DrawingContext dc, bool light, double cx, double y, double h, bool left, double lx) {
    var o = Img("assets/brand/aura-orquidea-" + (light ? "marfil" : "dorado") + ".png"); var t = Img("assets/brand/aura-texto-" + (light ? "marfil" : "dorado") + ".png");
    double ow = o.PixelWidth * h / o.PixelHeight, th = h * 0.62, tw = t.PixelWidth * th / t.PixelHeight, gap = h * 0.25, total = ow + gap + tw;
    double x = left ? lx : cx - total / 2; dc.DrawImage(o, new Rect(x, y, ow, h)); dc.DrawImage(t, new Rect(x + ow + gap, y + (h - th) / 2, tw, th));
  }
  static void Frame(DrawingContext dc, double W, double H, Brush br) {
    double i = Math.Round(Math.Min(W, H) * 0.028); var p = new Pen(br, 1.5); p.Freeze(); dc.DrawRectangle(null, p, new Rect(i, i, W - 2 * i, H - 2 * i));
  }

  public static void Render(Concept c, int W, int H, string file) {
    var dv = new DrawingVisual(); RenderOptions.SetBitmapScalingMode(dv, BitmapScalingMode.HighQuality);
    using (var dc = dv.RenderOpen()) {
      var im = Img(c.Img); bool land = W > H * 1.3; bool story = H >= W * 1.7; double u = Math.Min(W, H);
      double top = story ? H * 0.12 : H * 0.06, bottomSafe = story ? H * 0.18 : H * 0.065;
      Brush fg = c.Full ? WHITE : INK, fg2 = c.Full ? WHITE : INK2, accent = c.Full ? LIGHTGOLD : GOLD;
      if (c.Full) {
        Cover(dc, im, new Rect(0, 0, W, H), null, c.Fx, c.Fy);
        var g = new LinearGradientBrush(Color.FromArgb(0, 24, 17, 14), Color.FromArgb(225, 24, 17, 14), 90);
        if (land) { g.GradientStops[0].Color = Color.FromArgb(225, 24, 17, 14); g.GradientStops[1].Color = Color.FromArgb(0, 24, 17, 14); g.StartPoint = new Point(0, 0); g.EndPoint = new Point(0.8, 0); }
        else { g.StartPoint = new Point(0, 0.35); g.EndPoint = new Point(0, 1); }
        dc.DrawRectangle(g, null, new Rect(0, 0, W, H));
        dc.DrawRectangle(new LinearGradientBrush(Color.FromArgb(110, 24, 17, 14), Color.FromArgb(0, 24, 17, 14), 90), null, new Rect(0, 0, W, H * 0.24));
      } else dc.DrawRectangle(IVORY, null, new Rect(0, 0, W, H));

      if (land) {
        double tx, tw = W * 0.46, y = H * 0.13;
        if (!c.Full) { double m = W * 0.05; var pr = new Rect(m, m * 0.9, W * 0.36, H - m * 1.8); Cover(dc, im, pr, Arch(pr), c.Fx, c.Fy); tx = W * 0.47; }
        else tx = W * 0.06;
        Logo(dc, c.Full, 0, y, H * 0.075, true, tx); y += H * 0.075 + H * 0.075;
        var k = FT(Track(c.Kicker), Sans, H * 0.03, accent, tw, TextAlignment.Left); dc.DrawText(k, new Point(tx, y)); y += k.Height + H * 0.03;
        var hd = Headline(c, H * 0.082, fg, accent, tw, TextAlignment.Left); dc.DrawText(hd, new Point(tx, y)); y += hd.Height + H * 0.035;
        var sb = FT(c.Sub, Sans, H * 0.034, fg2, tw, TextAlignment.Left); dc.DrawText(sb, new Point(tx, y)); y += sb.Height + H * 0.055;
        Pill(dc, c.Cta, 0, y, H * 0.027, c.Full ? WHITE : INK, c.Full ? INK : WHITE, true, tx);
      } else {
        double cx = W / 2.0, tw = W * 0.8, logoH = u * 0.052;
        Logo(dc, c.Full, cx, top, logoH, false, 0);
        double sf = story ? 1.18 : 1.0; double hs = u * (story ? 0.092 : (H <= W ? 0.066 : 0.078));
        var k = FT(Track(c.Kicker), Sans, u * 0.025 * sf, accent, tw, TextAlignment.Center);
        var hd = Headline(c, hs, fg, accent, tw, TextAlignment.Center);
        var sb = FT(c.Sub, Sans, u * 0.031 * sf, fg2, tw, TextAlignment.Center);
        double pillH = u * 0.023 * sf * 3.4, textH = k.Height + u * 0.022 + hd.Height + u * 0.022 + sb.Height + u * 0.04 + pillH;
        double ty = H - bottomSafe - textH;
        if (!c.Full) {
          double py = top + logoH + u * 0.05, ph = ty - u * 0.05 - py;
          double pw = story ? Math.Min(W * 0.72, ph * 0.66) : Math.Min(W * (H <= W ? 0.44 : 0.66), ph * 0.8);
          var pr = new Rect(cx - pw / 2, py, pw, ph); Cover(dc, im, pr, Arch(pr), c.Fx, c.Fy);
        }
        double y = ty; dc.DrawText(k, new Point(cx - tw / 2, y)); y += k.Height + u * 0.022;
        dc.DrawText(hd, new Point(cx - tw / 2, y)); y += hd.Height + u * 0.022;
        dc.DrawText(sb, new Point(cx - tw / 2, y)); y += sb.Height + u * 0.04;
        Pill(dc, c.Cta, cx, y, u * 0.023 * sf, c.Full ? WHITE : INK, c.Full ? INK : WHITE, false, 0);
      }
      Frame(dc, W, H, c.Full ? B("#99F3DFB4") : GOLD);
    }
    Save(dv, W, H, file, false);
  }

  static void Save(Visual v, int W, int H, string file, bool png) {
    var rtb = new RenderTargetBitmap(W, H, 96, 96, PixelFormats.Pbgra32); rtb.Render(v);
    BitmapEncoder e; if (png) e = new PngBitmapEncoder(); else { var j = new JpegBitmapEncoder(); j.QualityLevel = 90; e = j; }
    e.Frames.Add(BitmapFrame.Create(rtb)); using (var fs = File.Create(R + file)) e.Save(fs);
  }

  public static void Logos() {
    var dv = new DrawingVisual(); RenderOptions.SetBitmapScalingMode(dv, BitmapScalingMode.HighQuality);
    using (var dc = dv.RenderOpen()) { dc.DrawRectangle(IVORY, null, new Rect(0, 0, 1200, 1200)); var l = Img("assets/brand/aura-logo-dorado.png"); double h = 820, w = l.PixelWidth * h / l.PixelHeight; dc.DrawImage(l, new Rect(600 - w / 2, 190, w, h)); }
    Save(dv, 1200, 1200, @"anuncios\logos\logo-cuadrado-1200.png", true);
    dv = new DrawingVisual(); RenderOptions.SetBitmapScalingMode(dv, BitmapScalingMode.HighQuality);
    using (var dc = dv.RenderOpen()) { dc.DrawRectangle(IVORY, null, new Rect(0, 0, 1200, 300)); Logo(dc, false, 600, 70, 160, false, 0); }
    Save(dv, 1200, 300, @"anuncios\logos\logo-horizontal-1200x300.png", true);
    dv = new DrawingVisual(); RenderOptions.SetBitmapScalingMode(dv, BitmapScalingMode.HighQuality);
    using (var dc = dv.RenderOpen()) { dc.DrawRectangle(IVORY, null, new Rect(0, 0, 1080, 1080)); var o = Img("assets/brand/aura-orquidea-dorado.png"); double h = 640, w = o.PixelWidth * h / o.PixelHeight; dc.DrawImage(o, new Rect(540 - w / 2, 220, w, h)); }
    Save(dv, 1080, 1080, @"anuncios\logos\foto-perfil-1080.png", true);
  }
}
