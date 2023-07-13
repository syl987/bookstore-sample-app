declare module 'base64-buffer-thumbnail-no-cache' {
  function thumbnail(
    source: string,
    options: {
      percentage?: number;
      width?: number;
      height?: number;
      responseType?: 'buffer' | 'base64';
      jpegOptions?: { force: boolean; quality?: number };
      fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    },
  ): Promise<string>;

  export = thumbnail;
}
