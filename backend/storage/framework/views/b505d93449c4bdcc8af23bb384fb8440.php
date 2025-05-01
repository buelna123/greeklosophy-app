<?php
  $defaultFormatMethod = 'scale';
  $retrieveFormattedVideo = cloudinary()
      ->videoTag($publicId ?? '')
      ->setAttributes(['controls', 'loop', 'preload'])
      ->fallback('Your browser does not support HTML5 video tagsssss.')
      ->$defaultFormatMethod($width ?? '', $height ?? '');
?>
<?php /**PATH C:\Devv\Proyecto_clean\greeklosophy\backend\vendor\cloudinary-labs\cloudinary-laravel\views\components\video.blade.php ENDPATH**/ ?>