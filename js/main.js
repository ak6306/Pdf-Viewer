const url='../docs/Internet.pdf'

let pdfDoc=null,
    pageIsRendering=false,
    pageNum=1,
    pageNumIsPending=null

//Rendering pdf to the canvas
const scale=1.5,
  canvas=document.querySelector('#pdf-render'),
  ctx=canvas.getContext('2d')

  //Render Page
  const renderPage=num =>{
      pageIsRendering=true

      //Get page

      pdfDoc.getPage(num).then(page =>{
          //set scale
          const viewport =page.getViewport({ scale })
          canvas.height=viewport.height
          canvas.width=viewport.width

          const renderCtx ={
              canvasContext:ctx,
              viewport
          }


          page.render(renderCtx).promise.then(()  =>{
              pageIsRendering=false

              if(pageNumIsPending !=null){
                  renderPage(pageNumIsPending)
                  pageNumIsPending=null
              }

          }).catch()

          

          //Output current page
          document.querySelector('#page-num').textContent=num
      }).catch()

  }
  //Check if the page is rendering
  const queueRenderPage = num =>{
      if(pageIsRendering){
          pageNumIsPending=num
      }else{
          renderPage(num)
      }
  }



  //Show prev page
  const showPrevPage = () =>{
      if(pageNum <= 1){
          return
      }else{
          pageNum--
          queueRenderPage(pageNum)
      }
  }

  //Show next page
  const showNextPage = () =>{
    if(pageNum >= pdfDoc.numPages){
        return
    }else{
        pageNum++
        queueRenderPage(pageNum)
    }
}

//Show user entered page
document.getElementById("dynamic-no").addEventListener('keypress',(e) =>{
    var code=(e.keyCode ? e.keyCode : e.which)
    if(code==13){
        var dynamicPage=document.getElementById("dynamic-no").valueAsNumber
        if(dynamicPage>=1 && dynamicPage<=pdfDoc.numPages){
            pageNum=dynamicPage
            queueRenderPage(pageNum)
        }
    }
})
  //Get document
 pdfjsLib.getDocument(url).promise.then(pdfDoc_ =>{
     pdfDoc=pdfDoc_
     //console.log(pdfDoc)
     document.querySelector('#page-count').textContent=pdfDoc.numPages
     renderPage(pageNum)
 }).catch()


 //Button events
document.querySelector('#prev-page').addEventListener('click',showPrevPage)
document.querySelector('#next-page').addEventListener('click',showNextPage)
//document.querySelector('#dynamic').addEventListener('click',dynamicNumber)
