Add-Type -AssemblyName PresentationCore,WindowsBase,System.Xaml
Add-Type -ReferencedAssemblies PresentationCore,WindowsBase,System.Xaml -TypeDefinition @"
using System; using System.IO; using System.Windows; using System.Windows.Media; using System.Windows.Media.Imaging;
public static class LogoTool {
  public static string Run(string src, string outDir){
    BitmapSource f;
    using(var s=File.OpenRead(src)){ f=BitmapDecoder.Create(s,BitmapCreateOptions.None,BitmapCacheOption.OnLoad).Frames[0]; }
    var c=new FormatConvertedBitmap(f,PixelFormats.Bgra32,null,0);
    int W=c.PixelWidth,H=c.PixelHeight; var px=new byte[W*H*4]; c.CopyPixels(px,W*4,0);
    int bg=px[(10*W+10)*4]; int mn=255; for(int i=0;i<W*H;i++) mn=Math.Min(mn,(int)px[i*4]);
    var a=new double[W*H];
    for(int i=0;i<W*H;i++){ double v=(bg-px[i*4])/(double)(bg-mn)*1.25; if(v<0.08)v=0; if(v>1)v=1; a[i]=v; }
    Save(a,W,outDir+"aura-logo-dorado.png",168,130,52,240,0,1360,1340,700);
    Save(a,W,outDir+"aura-logo-marfil.png",250,244,232,240,0,1360,1340,700);
    Save(a,W,outDir+"aura-orquidea-dorado.png",168,130,52,505,265,1095,815,300);
    Save(a,W,outDir+"aura-orquidea-marfil.png",250,244,232,505,265,1095,815,300);
    Save(a,W,outDir+"aura-texto-dorado.png",168,130,52,280,1050,1320,1335,600);
    Save(a,W,outDir+"aura-texto-marfil.png",250,244,232,280,1050,1320,1335,600);
    Save(a,W,outDir+"favicon-512.png",168,130,52,470,230,1130,890,512);
    var sb=new System.Text.StringBuilder(); bool on=false; for(int y=0;y<H;y++){ int cnt=0,xa=W,xb=0; for(int x=0;x<W;x++) if(a[y*W+x]>0.3){cnt++; xa=Math.Min(xa,x); xb=Math.Max(xb,x);} if(cnt>0&&!on){sb.Append("start "+y+" ");on=true;} if(cnt==0&&on){sb.Append("end "+y+"; ");on=false;} } return sb.ToString();
  }
  static void Save(double[] a,int W,string path,int r,int g,int b,int x0,int y0,int x1,int y1,int maxW){
    int w=x1-x0,h=y1-y0; var o=new byte[w*h*4];
    for(int y=0;y<h;y++)for(int x=0;x<w;x++){ double v=a[(y+y0)*W+x+x0]; int k=(y*w+x)*4; o[k]=(byte)(b*v);o[k+1]=(byte)(g*v);o[k+2]=(byte)(r*v);o[k+3]=(byte)(255*v); }
    BitmapSource bmp=BitmapSource.Create(w,h,96,96,PixelFormats.Pbgra32,null,o,w*4);
    if(w>maxW){ double sc=(double)maxW/w; bmp=new TransformedBitmap(bmp,new ScaleTransform(sc,sc)); }
    var e=new PngBitmapEncoder(); e.Frames.Add(BitmapFrame.Create(bmp)); using(var fs=File.Create(path)) e.Save(fs);
  }
}
"@
[LogoTool]::Run("C:\Users\JENIFFER\AppData\Local\Temp\claude\C--Users-JENIFFER-AppData-Roaming-Claude-scratch-workspaces-0117431c-6b5f-4b2d-8407-b1f900b64926-dff0334f-c269-42c0-951e-5f70f6ca6158-scratch-2026-09-30-4c372d\78675278-34e7-4f13-8a41-d44d1cc6e17a\images\10.webp","C:\Users\JENIFFER\Downloads\aura-flowers-web\assets\brand\")
