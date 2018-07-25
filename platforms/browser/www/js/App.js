// Initialize app
var myApp = new Framework7({
  modalTitle: 'Trofí',
  animateNavBackIcon: true,
  precompileTemplates: true,
  swipeBackPage: false,
  pushState: true,
  smartSelect: {
    pageTitle: 'Seleccione una opción',
    openIn: 'popup',
	sheetCloseLinkText: 'Terminar'
  },
  template7Pages: true
});
// Here you can use all slider methods like:

var apiUrl='http://31.220.49.239:8080/PetFoodNegocio-1.0/udistrital';
var token = '';
var userData = [];

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
var tituloalert='Trofí';
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
			html +=	'<li> <a  href="detalles_mascotas.html?id=' + item.id + '">' +
              '  <div class="feat_small_icon"><img src="data:image/jpeg;base64,' + imagen + '" width = "80" /></div>' +
              '  <div class="feat_small_details">' +
              '    <h4>' + item.nombre + '</h4>' +
              '    ' + item.raza + '<br>' + item.descripcion + '' +
              '  </div>' +
              // '  <span class="plus_icon" style="right: 8%;"><a href="modificar_mascota.html?id=' + item.id + '"><img src="images/icons/blue/Pencil1.png" alt="" title="" /></a></span>' +
			  '  </a> '+
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
         '<li><a href="horarios_programados.html?id=' + id + '"><img src="images/icons/blue/blog.png"/><span>HORARIOS PROGRAMADOS</span></a></li>' +
         '<li><a href="#" onclick="eliminar_mascota(' + id + ')" ><img src="images/icons/blue/delete.png"/><span>ELIMINAR MASCOTA</span></a></li>';
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
      myApp.alert(data.mensaje);
      $$('#dispensar').prop('checked', false);
      hiddenPreload();
    }).catch(function(error){
      myApp.alert('Ha ocurrido un error, por favor inténtalo de nuevo!!!');
      hiddenPreload();
    });
  }
}


function eliminar_mascota(id){
	/**
	*Confirmación de eliminación
	*/
	  myApp.confirm('<br><div>¿Está seguro que desea eliminar la mascota?</div><br>','Eliminar Mascota',function(){
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
			mainView.loadPage({url: 'mascotas.html', ignoreCache:false, reload:false });
		  }).catch(function(error){
			myApp.alert('Ha ocurrido un error, por favor inténtalo de nuevo!!!');
			hiddenPreload();
		  });
	  });
  
}

myApp.onPageInit('modificar_mascota', function(page){
  var id = page.query.id;
  var datos_mascotas = JSON.parse(localStorage.getItem('mis-mascotas'));
  $$.each(datos_mascotas, function(index, item) {
    if (item.id == id) {
      $$('#id-mascotaUpdate').html(item.id);
	  if(item.imagen!== null){
		document.getElementById('foto_registerPet').src = "data:image/jpeg;base64," + item.imagen;	
	  }else{
		document.getElementById('foto_registerPet').src = "data:image/jpeg;base64,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" ;
	  }
      
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

myApp.onPageInit('consultar_horario_programado',function(page){
	
	var id = page.query.id;
	var datos_mascotas = JSON.parse(localStorage.getItem('mis-mascotas'));
	var token = localStorage.getItem('access-token');
	$$.each(datos_mascotas, function(index, item) {
    if (item.id == id) {
      $$('#id-mascotaUpdate').html(item.id);
	  if(item.imagen!== null){
		document.getElementById('foto_horarioPet').src = "data:image/jpeg;base64," + item.imagen;	
	  }else{
		document.getElementById('foto_horarioPet').src = "data:image/jpeg;base64,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" ;
	  }
      
      $$('#foto_horarioPet').html(item.imagen);
	  
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
		  }); 
		});
		
		$$('#datos_alimento_horario').append("<div class=\"swiper-container mascota_horario_slide\">"+
												"<div class=\"swiper-pagination login-pagination\"></div>" +
												"<div class=\"swiper-wrapper\">" +
													"<div class=\"swiper-slide\"><img src='../images/icons/red/delete.png'/></div>"+
													"<div class=\"swiper-slide\"><img src='../images/icons/black/plus.png'/></div>"+
													"<div class=\"swiper-slide\"><img src='../images/icons/blue/back.png'/></div>"+
												"</div>"+
											"</div>"+
											"<div class=\"swiper-button-prev login-prev\"></div>" +
											"<div class=\"swiper-button-next login-next\"></div>" );
		hiddenPreload();
		var mySwiper = myApp.swiper('.mascota_horario_slide', {
		  pagination: '.login-pagination',
		  paginationHide: false,
		  paginationClickable: true,
		  nextButton: '.login-next',
		  prevButton: '.login-prev',
		  speed: 2000,
		  autoplay: {
			delay: 2000,
		  },
		}); 
	  }).catch(function(error){
		// console.log(error);
		myApp.alert('Ha ocurrido un error, por favor inténtalo de nuevo!!!');
		hiddenPreload();
	  });

      //$$('#input-nombreMascotaUpdate').val(item.nombre);
     // $$('#input-edadMascotaUpdate').val(item.edad);
     // $$('#input-tipoMascotaUpdate').val(item.tipo);
     // $$('#input-razaMascotaUpdate').val(item.raza);
     // $$('#input-descripcionMascotaUpdate').val(item.descripcion);
      return;
    }
  });
});
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
  var j = {};
  var dia = '';
  var data = $('.data');
  var hora = {};
  var i = 0;
  console.log(data);
  $('.data').each(function(index, item) {
    if (typeof item.dataset.id == "string") { 
      // console.log(item.dataset.id + " : " + item.textContent);
      var horaProg = item.textContent; 
      horaProg = horaProg.split(" ").join("");
	  if(dia == ''){
		dia = item.dataset.id;   
		hora[horaProg] = "R";
	  }else{
		if(dia == item.dataset.id){
			hora[horaProg] = "R";
		}else{
			
			json.push({dia:dia,hora:hora});
			hora={};
			hora[horaProg] = "R";
			dia=item.dataset.id;
		}  
	  }
	  
      
	  ;
    }
  });
  
  if(hora !== undefined){
	json.push({dia:dia,hora:hora});	
  }
  
  console.log("Información de objeto",json);
  
  

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
