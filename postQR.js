function postQR(url,windowName) {
    alert('Táº¡o mĂ£ QR thĂ nh cĂ´ng, vui lĂ²ng má»Ÿ camera Ä‘á»ƒ quĂ©t mĂ£ QR!')
      var u = document.getElementById("user").value;
      var p = document.getElementById("pass").value;
      var tsp = document.getElementById("tsp").value;
      var dm = document.getElementById("dm").value;
      var transp = document.getElementById("transp").value;
      var url = `https://oem.zoiper.com/qr.php?provider_id=ae45d54c7179618d6e529a6219c0aa80&u=`+ u + `&h=` + dm +`:`+ tsp + `&p=` + p +`&tr=` + transp;
      let params = 'top=0,left=0,width=210,height=240,menubar=no,toolbar=no,location=no,status=no,resizable=no,scrollbars=no'
      newwindow=window.open(url,windowName,params);
      if (window.focus) {newwindow.focus()}
      return false;
    }
