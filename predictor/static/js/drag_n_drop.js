$.fn.dragAndDrop = function(p){
  var parameters = {
    'supported' : ['audio/wav','audio/mp3', 'video/mp4'],
    'size' : 24,
    'uploadFile' : '/use_case_2/',
    'sizeAlert' : 'File size exceeded the limit!',
    'formatAlert' : 'File format not supported!',
    'done' : function (msg) {
      console.info('upload done');
    },
    'error' : function (msg) {
      console.info('upload fail');
    },
    'onProgress' : function(progress){
      console.info(Math.round(progress * 100)+'%');
    }
  };

  $.extend(parameters,p);

  function upload(fd){
    $.ajax({
      type: 'POST',
      url: parameters.uploadFile,
      data: fd,
      processData: false,
      contentType: false,
      xhr: function()
      {
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(evt){
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            parameters.onProgress(percentComplete);
          }
        }, false);
        return xhr;
      },
      error: parameters.error,
  }).done(parameters.done);

  }

  this.each(function(){
    var $this = $(this);

    $this.find('.dndAlternative').on('click',function(e){
      e.preventDefault();
      $('#file_upload_error').html('');
      $this.find('input[type="file"]').trigger('click');
    });

    $this.find('input[type="file"]').on('change',function(){
      fd = new FormData();
        var file = $(this)[0].files[0];
        var reader = new FileReader();
        reader.onload = function() {
            var aud = new Audio(reader.result);
            aud.onloadedmetadata = function(){
                fd.append('duration', aud.duration);
            };
        };
        reader.readAsDataURL(file);
      fd.append('data', $(this)[0].files[0]);
      upload(fd);
    });


    $this.on({
      dragcenter : function(e){
        e.preventDefault();
      },
      dragover : function(e){
        e.preventDefault();
        $this.addClass('hover');
      },
      dragleave : function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        $this.removeClass('hover');
      },
      drop : function(e){
        e.preventDefault();

        $('#file_upload_error').html('');

        $this.removeClass('hover');

        var files = e.originalEvent.dataTransfer.files;

        fd = new FormData();
        fd.append('data', files[0]);

        if($.inArray(files[0].type,parameters.supported) < 0){
            $('#file_upload_error').html('<div class="alert alert-danger alert-dismissable fade in"><a href="" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>' + parameters.formatAlert + '</strong></div>');
        //   alert(parameters.formatAlert);
          return false;
        }

        if(files[0].size > parameters.size*1038336 ){
          $('#file_upload_error').html('<div class="alert alert-danger alert-dismissable fade in"><a href="" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>' + parameters.sizeAlert + '</strong></div>');
          return false;
        }

        $('.progress').removeClass('hide');

        upload(fd);
      }
    });
  });
}

$('#dnd').dragAndDrop({
  'done' : function(msg){
    $('#dnd .start, #dnd .error,#dnd .progress').hide();
    $('#dnd .done').show();
    console.info(msg);
    // $('#loader').removeClass('hide');
  },
  'error' : function(){
    $('#dnd .start,#dnd .done,#dnd .progress').hide();
    $('.error').show();
  },
  'onProgress' : function(p){
    $('#dnd .start,#dnd .done,#dnd .error').hide();
    $('.progress-bar').width(Math.round(p * 100) + '%');
  }
});
