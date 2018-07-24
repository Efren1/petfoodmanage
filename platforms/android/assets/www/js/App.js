// Initialize app
var myApp = new Framework7({
  modalTitle: 'PetFood',
  animateNavBackIcon: true,
  precompileTemplates: true,
  swipeBackPage: false,
  pushState: true,
  template7Pages: true
});

var apiUrl='http://31.220.49.239:8080/PetFoodNegocio-1.0/udistrital';
var token = '';
var userData = [];

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
var tituloalert='PetFood';
var foto_profile;
var foto_registerPet;
var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var id_usuario;
var nombre_usuario = null;
var foto_usuario;
var apellido_usuario;
var email_usuario;
var telefono_usuario;
var direccion_usuario;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    if(localStorage.getItem('token')){
      myApp.closeModal();
      token = localStorage.getItem('token');
      if (localStorage.getItem('userInfo')) {
        DatosPrinUsua(JSON.parse(localStorage.getItem('userInfo')));
      }else {
        getInfoUserAuth();
      }
    mainView.loadPage({url:'home.html', ignoreCache:false, reload:false });
    }
    FCMPlugin.onNotification(function(data){
      if(data.wasTapped){
        navigator.notification.alert(data.body,'',tituloalert,'Aceptar');
      }else{
        navigator.notification.alert(data.body,'',tituloalert,'Aceptar');
      }
    });
    
});

function DatosPrinUsua(data) {
    console.log(data);
    nombre_usuario = data.nombres;
    apellido_usuario = data.apellidos;
    email_usuario = data.email;
    foto_usuario = data.foto;
    telefono_usuario = data.celular;
    direccion_usuario = data.direccion;
    // console.log(nombre_usuario);
}

// myApp.onPageInit('home', function (page) {
//     // Do something here for "about" page

//     myApp.closePanel();
//     // $$('#nombre_index_user').html(nombre_usuario + ' ' + apellido_usuario);
//     // $$('#correo_index_user').html(email_usuario);
// })

myApp.onPageInit('profile', function(page){

  $$('.profile-avatar').click(
    function(){
      capturePhotoEdit();
    }
  );

  foto_profile = document.getElementById('photo_profile');
  pictureSource=navigator.camera.PictureSourceType;
  destinationType=navigator.camera.DestinationType;

  foto_profile.src = "data:image/jpeg;base64," + foto_usuario;
  
  $$('#name-profile').html(nombre_usuario);
  $$('#input-nombre-profile').val(nombre_usuario);
  $$('#input-apellidos-profile').val(apellido_usuario);
  $$('#input-email-profile').val(email_usuario);
  $$('#input-phone').val(telefono_usuario);
  $$('#input-address').val(direccion_usuario);

});

// myApp.onPageInit('about', function (page) {
//     initMap();
//     myApp.closePanel();
// });

// myApp.onPageInit('localizacion', function (page) {
//   var lat = page.query.lat;
//   var lng = page.query.lng;
//   var fecha = page.query.fecha;
//   console.log(lat+lng+fecha);
//   initMap(lat, lng, fecha);
// })

myApp.onPageInit('mascotas', function (page) {
    myApp.closePanel();
    showPreload();
    fetch(apiUrl+'/mascota/v01/usuario', {
        method:'GET',
        headers:{
         	'Accept': 'application/json, text/plain',
            'Content-Type':'application/json',
        	'access-token' : token
        }
	}).then(function(response) {
		return response.json();
	}).then(function(data) {
		console.log(data);
    localStorage.setItem('mis-mascotas',JSON.stringify(data));
		var html = '';
    var imagen;
		$$.each(data, function(index, item) {
      if (item.imagen == null) {
        imagen = "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";
      }else{
        imagen = item.imagen;
      }
			html +=	'<li>' +
              '  <div class="feat_small_icon"><img src="data:image/jpeg;base64,' + imagen + '" width = "80" /></div>' +
              '  <div class="feat_small_details">' +
              '    <h4><a href="#">' + item.nombre + '</a></h4>' +
              '    <a href="#">' + item.raza + '<br>' + item.descripcion + '</a>' +
              '  </div>' +
              // '  <span class="plus_icon" style="right: 8%;"><a href="modificar_mascota.html?id=' + item.id + '"><img src="images/icons/blue/Pencil1.png" alt="" title="" /></a></span>' +
              '  <span class="plus_icon"><a href="detalles_mascotas.html?id=' + item.id + '"><img src="images/icons/blue/plus.png" alt="" title="" /></a></span>' +
              '</li>';
		});
		$$('#mis_mascotas').html(html);
	 	hiddenPreload();
	}).catch(function(error){
		myApp.alert('Ha ocurrido un error, por favor inténtalo de nuevo!!!');
		hiddenPreload();
	});
});

myApp.onPageInit('detalle_mascota', function(page){
  var id = page.query.id;
  html = '<li><a href="programar_comida.html?id=' + id + '" ><img src="images/icons/blue/timeProgram.png"/><span>PROGRAMAR COMIDA</span></a></li>' +
         '<li><a href="#" onclick="comida_ya(' + id + ')"><img src="images/icons/blue/dog-food.png"/><span>DAR DE COMER</span></a></li>' +
         '<li><a href="modificar_mascota.html?id=' + id + '"><img src="images/icons/blue/modification.png"/><span>MODIFICAR MASCOTA</span></a></li>' +
         '<li><a href="#"><img src="images/icons/blue/blog.png"/><span>HORARIOS PROGRAMADOS</span></a></li>' +
         '<li><a href="#" onclick="eliminar_mascota(' + id + ')" class="external"><img src="images/icons/blue/delete.png"/><span>ELIMINAR MASCOTA</span></a></li>';
  $$('#detalle-mascota').html(html);
})

function comida_ya(id){
  myApp.alert('<br><div>Activar Mecanismo</div><br>' +
              '<label class="label-switch">' +
              '  <input type="checkbox" id="dispensar" onchange="dispensar(' + id + ')">' +
              '  <div class="checkbox"></div>' +
              '<label>');
}

function dispensar(id){
  if ($$('#dispensar').prop('checked') == true){
    showPreload();
    fetch(apiUrl+'/mascota/v01/' + id + '/alimentar', {
      method:'POST',
      body:JSON.stringify({
        ejecucion: "S"
      }),
      headers:{
        'Accept': 'application/json, text/plain',
        'Content-Type':'application/json',
        'access-token' : token
      }
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log(data);
      alert(data.mensaje);
      $$('#dispensar').prop('checked', false);
      hiddenPreload();
    }).catch(function(error){
      myApp.alert('Ha ocurrido un error, por favor inténtalo de nuevo!!!');
      hiddenPreload();
    });
  }
}

function eliminar_mascota(id){
  showPreload();
  fetch(apiUrl+'/mascota/v01/delete/' + id, {
    method:'POST',
    body:JSON.stringify({
      
    }),
    headers:{
      'Accept': 'application/json, text/plain',
      'Content-Type':'application/json',
      'access-token' : token
    }
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    console.log(data);
    hiddenPreload();
  }).catch(function(error){
    myApp.alert('Ha ocurrido un error, por favor inténtalo de nuevo!!!');
    hiddenPreload();
  });
}

myApp.onPageInit('modificar_mascota', function(page){
  var id = page.query.id;
  var datos_mascotas = JSON.parse(localStorage.getItem('mis-mascotas'));
  $$.each(datos_mascotas, function(index, item) {
    if (item.id == id) {
      $$('#id-mascotaUpdate').html(item.id);
      document.getElementById('foto_registerPet').src = "data:image/jpeg;base64," + item.imagen;
      $$('#photo-mascotaUpdate').html(item.imagen);
      $$('#input-nombreMascotaUpdate').val(item.nombre);
      $$('#input-edadMascotaUpdate').val(item.edad);
      $$('#input-tipoMascotaUpdate').val(item.tipo);
      $$('#input-razaMascotaUpdate').val(item.raza);
      $$('#input-descripcionMascotaUpdate').val(item.descripcion);
      return;
    }
  });
})

$$(document).on('submit','#form-mascotaUpdate',function(e){
  e.preventDefault();
  showPreload();
  fetch(apiUrl + '/mascota/v01/' + $$('#id-mascotaUpdate').html() + '/actualizar' , {
    method:'POST',
    body:JSON.stringify({
      nombre: $$('#input-nombreMascotaUpdate').val(),
      edad: $$('#input-edadMascotaUpdate').val(),
      raza: $$('#input-razaMascotaUpdate').val(),
      descripcion: $$('#input-descripcionMascotaUpdate').val(),
      tipo: $$('#input-tipoMascotaUpdate').val(),
      imagen: $$('#photo-mascotaUpdate').html()
    }),
    headers:{
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json',
      'access-token' : token
    }
  }).then(function(response) {
      return response.json();
  }).then(function(data) {
      console.log(data);
      myApp.alert(data.mensaje);
      mainView.loadPage({url: 'mascotas.html', ignoreCache:false, reload:false });
      hiddenPreload();
  }).catch(function(error){
      myApp.alert('No se ha podido registrar la mascota, Intenta nuevamente!!!');
      hiddenPreload();
  });
})

myApp.onPageInit('registrar_mascotas', function (page) {
    myApp.closePanel();

$('.user_avatar').click(
    function(){
      capturePhotoEditMascota();
    }
  );

  foto_registerPet = document.getElementById('foto_registerPet');
  pictureSource=navigator.camera.PictureSourceType;
  destinationType=navigator.camera.DestinationType;
})

// Form Login
$$('#form-login').on('submit', function (e) {
    e.preventDefault();
  showPreload();
  fetch(apiUrl+'/usuario/v01/auth', {
    method:'POST',
    headers:{
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({
      email:$$('#email').val(),
      password:$$('#pass').val(),
    })
  }).then(function(response) {
    if (response.headers.get("access-token")) {
      localStorage.setItem('token',response.headers.get("access-token"));
      myApp.closeModal();
      token = response.headers.get("access-token");
      getInfoUserAuth();
      // mainView.loadPage({url:'home.html', ignoreCache:true, reload:true });
    }
    //response.headers.forEach(function(val, key) { console.log(key + ' -> ' + val); });
  }).then(function(data) {
        FCMPlugin.getToken(
          function(tokenApp){
            fetch(apiUrl + '/usuario/v01/notificacion/token', {
              method: 'POST',
              body: JSON.stringify({
              token: tokenApp,
            }),
            headers: {
              'Accept': 'application/json, text/plain',
              'Content-Type': 'application/json',
              'access-token' : token
            }
          });
          });
        mainView.loadPage({url:'home.html', ignoreCache:false, reload:false }); 
        hiddenPreload();
  }).catch(function(error){
    myApp.alert(error + ' Ha ocurrido un error por favor inténtalo de nuevo');
    hiddenPreload();
  });
});

// Form Register
$$('#form-register').on('submit', function (e) {
  e.preventDefault();
  if ($$('#pass-register').val() != '' && $$('#confirm-pass').val() != '') {
    if ($$('#pass-register').val() == $$('#confirm-pass').val()) {
      showPreload();
      fetch(apiUrl+'/usuario/v01/registro', {
          method:'put',
          body:JSON.stringify({
              nombres:$$('#user').val(),
              apellidos:$$('#apellidos-register').val(),
              password:$$('#pass-register').val(),
              email:$$('#email-register').val(),
              tipoUsuario: 'USER'
          }),
          headers:{'Accept': 'application/json, text/plain',
                   'Content-Type':'application/json'}
      }).then(function(response) {
          return response.json();
      }).then(function(data) {
          console.log(data);
          myApp.alert(data.mensaje);
          hiddenPreload();
      }).catch(function(error){
        myApp.alert('No se ha podido actualizar la información del usuario, Intente nuevamente!!!');
        hiddenPreload();
      });
    }else{
      myApp.alert('Las contraseñas no coinciden!!!');
    }
  }else{
    myApp.alert('Los campos Contraseña y confirmar Contraseña deben contener algun caracter!!!');
  }
});

$$('#form-forwardPass').on('submit', function (e) {
  e.preventDefault();
  showPreload();
  fetch(apiUrl+'/usuario/v01/recuperar', {
      method:'POST',
      body:JSON.stringify({
        email: $$('#input-forwardPass').val()
      }),
      headers:{'Accept': 'application/json, text/plain',
               'Content-Type':'application/json'}
  }).then(function(response) {
      return response.json();
  }).then(function(data) {
      console.log(data);
      myApp.alert(data.mensaje);
      hiddenPreload();
  }).catch(function(error){
    myApp.alert('No se ha podido recuperar la contraseña, por favor intenta de nuevo!!!');
    hiddenPreload();
  });
});

function logout(){
  localStorage.clear();
  mainView.loadPage({url: 'home.html', ignoreCache:false, reload:false});
  location.reload();
  // myApp.openModal();
}

function getInfoUserAuth() {
  console.log(token);
  fetch(apiUrl+'/usuario/v01/detalle', {
      method:'GET',
      headers:{
          'access-token' : token
      }
  }).then(function(response) {
      return response.json();
  }).then(function(data){
      localStorage.setItem('userInfo',JSON.stringify(data));
      DatosPrinUsua(data);
  });
};

$$(document).on('submit','#form-registro', function (e) {
  e.preventDefault();
  if ($$('#input-nombre').val() == '') {
    myApp.alert('Por favor ingrese el nombre de la mascota');
  }else if ($$('#input-edad').val() == '') {
    myApp.alert('Por favor ingrese la edad de la mascota');
  }else if ($$('#input-raza').val() == '') {
    myApp.alert('Por favor ingrese la raza de la mascota');
  }else if ($$('#input-descripcion-mascota').val() == '') {
    myApp.alert('Por favor ingrese la descripción de la mascota');
  }else if ($$('#photo_registerPet').val() == '') {
    myApp.alert('Por favor capture una fotografia de la mascota');
  }else if ($$('#input-tipo').val() == '') {
    myApp.alert('Por favor ingrese el tipo de mascota');
  }else if ($$('#input-id-dispositivo').val() == '') {
    myApp.alert('Por favor el id del dispositivo');
  }else{
  showPreload();
  fetch(apiUrl + '/mascota/v01', {
    method:'PUT',
    body:JSON.stringify({
      nombre: $$('#input-nombre').val(),
      edad: $$('#input-edad').val(),
      raza: $$('#input-raza').val(),
      descripcion: $$('#input-descripcion-mascota').val(),
      imagen: $$('#photo_registerPet').html(),
      tipo: $$('#input-tipo').val(),
      dispositivo: {
        codigoQr : $$('#input-id-dispositivo').val()
      }
    }),
    headers:{
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json',
      'access-token' : token
    }
  }).then(function(response) {
      return response.json();
  }).then(function(data) {
      console.log(data);
      if (data.codigo == 'OK') {
        myApp.alert('Se ha registrado la mascota de manera correcta');
      }else{
        myApp.alert('No se ha podido registrar la mascota, Intente nuevamente!!!');
      }
      mainView.loadPage({url:'home.html', ignoreCache:false, reload:false });
      hiddenPreload();
  }).catch(function(error){
      myApp.alert('No se ha podido registrar la mascota, Intenta nuevamente!!!');
      hiddenPreload();
  });
  }
})

$$(document).on('submit','#form_profileUpdate', function (e) {
  e.preventDefault();
  if ($$('#input-pass-profile').val() == $$('#input-Confpass-profile').val()) {
    showPreload();
    fetch(apiUrl + '/usuario/v01/actualizar', {
      method:'POST',
      body:JSON.stringify({
        nombres: $$('#input-nombre-profile').val(),
        apellidos: $$('#input-apellidos-profile').val(),
        direccion: $$('#input-address').val(),
        celular: $$('#input-phone').val(),
        password: $$('#input-pass-profile').val()
      }),
      headers:{
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json',
        'access-token' : token
      }
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
        if (data.codigo == 'OK') {
          myApp.alert(data.mensaje);
          myApp.closeModal(".datos-usuario");          
          getInfoUserAuth();
        }else{
          myApp.alert('No se ha podido actualizar la información del usuario, Intente nuevamente!!!');
        }
        hiddenPreload();
    }).catch(function(error){
        myApp.alert('No se ha podido actualizar la información del usuario, Intente nuevamente!!!');
        hiddenPreload();
    });
  }else{
    myApp.alert('Las contraseñas no coinciden!!!');
    return;
  }
})

function onPhotoDataSuccess(imageData) {
    showPreload();
    fetch(apiUrl+'/usuario/v01/actualizar', {
    method:'post',
    body:JSON.stringify({
        foto: imageData 
    }),
    headers:{
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json',
        'access-token' : token
    }
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
        foto_profile.src = "data:image/jpeg;base64," + imageData;
        myApp.alert('Se ha actualizado la foto de perfil satisfactoriamente!!!');
        getInfoUserAuth();
        hiddenPreload();
    }).catch(function(error){
        myApp.alert('Ha ocurrido un error, por favor inténtalo de nuevo!!!');
        hiddenPreload();
    });

}

function onPhotoURISuccess(imageURI) {
    //var largeImage = document.getElementById('foto_profile');
    // largeImage.style.display = 'block';
    // myApp.alert(imageURI);
    $$('#photo_registerPet').html(imageURI);
    foto_registerPet.src = "data:image/jpeg;base64," + imageURI;
}

function capturePhotoEdit() {
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, allowEdit: true,
    destinationType: destinationType.DATA_URL, targetWidth: 500, targetHeight: 500, });
}

function capturePhotoEditMascota() {
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, allowEdit: true,
    destinationType: destinationType.DATA_URL, targetWidth: 500, targetHeight: 500, });
}

function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
    destinationType: destinationType.FILE_URI,
    sourceType: source });
}

function onFail(message) {
    myApp.alert('Error: ' + message);
}

function qrRegister() {
// var taller = $$('#taller').val();  
cordova.plugins.barcodeScanner.scan(

  function (result) {
    console.log(result);
    $$('#input-id-dispositivo').val(result.text);
    console.log('listo');
  },
  function (error) {
    myApp.alert("Escaneo fallido: " + error);
  }
);

}

function qrModify() {
// var taller = $$('#taller').val();  
cordova.plugins.barcodeScanner.scan(

  function (result) {
    console.log(result);
    $$('#input-dispensadorMascotaUpdate').val(result.text);
    console.log('listo');
  },
  function (error) {
    myApp.alert("Escaneo fallido: " + error);
  }
);

}

function index_login(obj){
  if (obj == 1) { 
    javascript:document.getElementById('content-register').style.display = 'block'; 
    javascript:document.getElementById('content-login').style.display = 'none';
    javascript:document.getElementById('recuperar-password').style.display = 'none';
  }else if(obj == 2){
    javascript:document.getElementById('content-register').style.display = 'none'; 
    javascript:document.getElementById('content-login').style.display = 'block';
    javascript:document.getElementById('recuperar-password').style.display = 'none';
  }else if(obj == 3){
    javascript:document.getElementById('content-register').style.display = 'none'; 
    javascript:document.getElementById('content-login').style.display = 'none';
    javascript:document.getElementById('recuperar-password').style.display = 'block';
  }
}

var showPreload = function (e){
  $('body').append('<div class="container-loader">' +
                    '  <div class="dog">' +
                    '    <div class="dog-body">' +
                    '      <div class="dog-tail">' +
                    '        <div class="dog-tail">' +
                    '          <div class="dog-tail">' +
                    '            <div class="dog-tail">' +
                    '              <div class="dog-tail">' +
                    '                <div class="dog-tail">' +
                    '                  <div class="dog-tail">' +
                    '                    <div class="dog-tail"></div>' +
                    '                  </div>' +
                    '                </div>' +
                    '              </div>' +
                    '            </div>' +
                    '          </div>' +
                    '        </div>' +
                    '      </div>' +
                    '    </div>' +
                    '    <div class="dog-torso"></div>' +
                    '    <div class="dog-head">' +
                    '      <div class="dog-ears">' +
                    '        <div class="dog-ear"></div>' +
                    '        <div class="dog-ear"></div>' +
                    '      </div>' +
                    '      <div class="dog-eyes">' +
                    '        <div class="dog-eye"></div>' +
                    '        <div class="dog-eye"></div>' +
                    '      </div>' +
                    '      <div class="dog-muzzle">' +
                    '        <div class="dog-tongue"></div>' +
                    '      </div>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>');
}

var hiddenPreload = function (e) {
    console.log('submit')
    $('.container-loader').remove();
};

var idMascota;
var json = [];
myApp.onPageInit('programar_comida',function(page){

  idMascota = page.query.id;
  var today = new Date();

  var pickerInlineL = myApp.picker ({
            input: '#picker-dateL',
            container: '#picker-date-containerL',
            toolbar: false,
            rotateEffect: true,
            value: [
               today.getHours(), 
               (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())
            ],
            
            formatValue: function (p, values, displayValues) {
               return displayValues[0] + ':' + values[1] ;
            },
            
            cols: [{
                  values: (function () {
                     var arr = [];
                     for (var i = 0; i <= 23; i++) { arr.push(i); }
                     return arr;
                  })(),
               },{
                  divider: true,
                  content: ':'
               },{
                  values: (function () {
                     var arr = [];
                     for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                     return arr;
                  })(),
               }]
  });

  var pickerInlineM = myApp.picker ({
            input: '#picker-dateM',
            container: '#picker-date-containerM',
            toolbar: false,
            rotateEffect: true,
            value: [
               today.getHours(), 
               (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())
            ],
            
            formatValue: function (p, values, displayValues) {
               return displayValues[0] + ':' + values[1] ;
            },
            
            cols: [{
                  values: (function () {
                     var arr = [];
                     for (var i = 0; i <= 23; i++) { arr.push(i); }
                     return arr;
                  })(),
               },{
                  divider: true,
                  content: ':'
               },{
                  values: (function () {
                     var arr = [];
                     for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                     return arr;
                  })(),
               }]
  });

  var pickerInlineW = myApp.picker ({
            input: '#picker-dateW',
            container: '#picker-date-containerW',
            toolbar: false,
            rotateEffect: true,
            value: [
               today.getHours(), 
               (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())
            ],
            
            formatValue: function (p, values, displayValues) {
               return displayValues[0] + ':' + values[1] ;
            },
            
            cols: [{
                  values: (function () {
                     var arr = [];
                     for (var i = 0; i <= 23; i++) { arr.push(i); }
                     return arr;
                  })(),
               },{
                  divider: true,
                  content: ':'
               },{
                  values: (function () {
                     var arr = [];
                     for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                     return arr;
                  })(),
               }]
  });

  var pickerInlineJ = myApp.picker ({
            input: '#picker-dateJ',
            container: '#picker-date-containerJ',
            toolbar: false,
            rotateEffect: true,
            value: [
               today.getHours(), 
               (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())
            ],
            
            formatValue: function (p, values, displayValues) {
               return displayValues[0] + ':' + values[1] ;
            },
            
            cols: [{
                  values: (function () {
                     var arr = [];
                     for (var i = 0; i <= 23; i++) { arr.push(i); }
                     return arr;
                  })(),
               },{
                  divider: true,
                  content: ':'
               },{
                  values: (function () {
                     var arr = [];
                     for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                     return arr;
                  })(),
               }]
  });

  var pickerInlineV = myApp.picker ({
            input: '#picker-dateV',
            container: '#picker-date-containerV',
            toolbar: false,
            rotateEffect: true,
            value: [
               today.getHours(), 
               (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())
            ],
            
            formatValue: function (p, values, displayValues) {
               return displayValues[0] + ':' + values[1] ;
            },
            
            cols: [{
                  values: (function () {
                     var arr = [];
                     for (var i = 0; i <= 23; i++) { arr.push(i); }
                     return arr;
                  })(),
               },{
                  divider: true,
                  content: ':'
               },{
                  values: (function () {
                     var arr = [];
                     for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                     return arr;
                  })(),
               }]
  });

  var pickerInlineS = myApp.picker ({
            input: '#picker-dateS',
            container: '#picker-date-containerS',
            toolbar: false,
            rotateEffect: true,
            value: [
               today.getHours(), 
               (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())
            ],
            
            formatValue: function (p, values, displayValues) {
               return displayValues[0] + ':' + values[1] ;
            },
            
            cols: [{
                  values: (function () {
                     var arr = [];
                     for (var i = 0; i <= 23; i++) { arr.push(i); }
                     return arr;
                  })(),
               },{
                  divider: true,
                  content: ':'
               },{
                  values: (function () {
                     var arr = [];
                     for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                     return arr;
                  })(),
               }]
  });

  var pickerInlineD = myApp.picker ({
            input: '#picker-dateD',
            container: '#picker-date-containerD',
            toolbar: false,
            rotateEffect: true,
            value: [
               today.getHours(), 
               (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())
            ],
            
            formatValue: function (p, values, displayValues) {
               return displayValues[0] + ':' + values[1] ;
            },
            
            cols: [{
                  values: (function () {
                     var arr = [];
                     for (var i = 0; i <= 23; i++) { arr.push(i); }
                     return arr;
                  })(),
               },{
                  divider: true,
                  content: ':'
               },{
                  values: (function () {
                     var arr = [];
                     for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                     return arr;
                  })(),
               }]
  });
  
  showPreload();
  fetch(apiUrl+'/mascota/v01/' + idMascota + '/horario/alimento', {
    method:'GET',
    headers:{
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json',
      'access-token' : token
    }
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    console.log(data);
    $$.each(data, function(index, item) {
      var dia = item.dia;
      // console.log(item.hora);
      $$.each(item.hora, function(index, item) {
        var id = dia + index;
        $$('#' + dia + 'datos_alimento').append("<div class='row data' id='" + id + "' data-id='" + dia + "' style='border-bottom: 3px dotted dodgerblue; margin-bottom: 15px;'>" +
                                          " <div class='col-80 texto-pro-comida'>" + 
                                              index + 
                                          " </div>" +
                                          " <div style='text-align: -webkit-right;' onclick='delete_horas(" + '"' + id + '"' + ")' class='col-20'>" +
                                          "   <img src='../images/icons/red/delete.png'/>" +
                                          " </div>" +
                                          "</div>");
      }); 
    });
    hiddenPreload();
  }).catch(function(error){
    // console.log(error);
    myApp.alert('Ha ocurrido un error, por favor inténtalo de nuevo!!!');
    hiddenPreload();
  });

});

function datos_alimento(dia){
  var datos = $$('#picker-date' + dia).val().split(":");
  var id = dia + datos[0] + datos[1];
  $$('#' + dia + 'datos_alimento').append("<div class='row data' id='" + id + "' data-id='" + dia + "' style='border-bottom: 3px dotted dodgerblue; margin-bottom: 15px;'>" +
                                          " <div class='col-80 texto-pro-comida'>" + 
                                              $$('#picker-date' + dia).val() + 
                                          " </div>" +
                                          " <div style='text-align: -webkit-right;' onclick='delete_horas(" + '"' + id + '"' + ")' class='col-20'>" +
                                          "   <img src='../images/icons/red/delete.png'/>" +
                                          " </div>" +
                                          "</div>");
}

function delete_horas(id){
  var dia = id.substr(0,1);
  var hora = id.substr(1);
  var j = {};
      j[hora] = "E";
  showPreload();
  fetch(apiUrl+'/mascota/v01/' + idMascota + '/horario/alimento', {
    method:'PUT',
    body:JSON.stringify([{
      dia: dia, 
      hora: j
    }]),
    headers:{
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json',
      'access-token' : token
    }
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    console.log(data);
    $$("#" + id).remove();
    hiddenPreload();
  }).catch(function(error){
    console.log(error);
    // myApp.alert('Ha ocurrido un error, por favor inténtalo de nuevo!!!');
    hiddenPreload();
  });
 }

function datos_prog_comida(){
  json = [];
  var data = $('.data');
  console.log(data);
  $('.data').each(function(index, item) {
    if (typeof item.dataset.id == "string") { 
      // console.log(item.dataset.id + " : " + item.textContent);
      var hora = item.textContent;
      hora = hora.split(" ").join("");
      var j = {};
      j[hora] = "R";
      json.push({dia:item.dataset.id, hora: j });
    }
  });

  showPreload();
  fetch(apiUrl+'/mascota/v01/' + idMascota + '/horario/alimento', {
    method:'PUT',
    body:JSON.stringify(json),
    headers:{
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json',
      'access-token' : token
    }
  }).then(function(response) {
    // return response.json();
  }).then(function(data) {
    console.log(data);
    hiddenPreload();
  }).catch(function(error){
    console.log(error);
    // myApp.alert('Ha ocurrido un error, por favor inténtalo de nuevo!!!');
    hiddenPreload();
  });

}
