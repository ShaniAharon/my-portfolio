'use strict';

function onInit() {
  //crate projs
  renderProjs();
}

function renderProjs() {
  var projs = getProjs();
  var strHtml = projs.map((proj) => {
    return `
        <div class="col-md-4 col-sm-6 portfolio-item">
        <a
          class="portfolio-link"
          data-toggle="modal"
          href="#portfolioModal1"
          onclick="renderModal('${proj.id}')"
        >
          <div class="portfolio-hover">
            <div class="portfolio-hover-content">
              <i class="fa fa-plus fa-3x"></i>
            </div>
          </div>
          <img
            class="img-fluid"
            src="${proj.imgSrc}"
            alt=""
          />
        </a>
        <div class="portfolio-caption">
          <h4>${proj.name}</h4>
          <p class="text-muted">${proj.desc}</p>
        </div>
      </div>
        `;
  });
  const elGallery = document.querySelector('.proj-gallery');
  elGallery.innerHTML = strHtml.join('');
}

function renderModal(projId) {
  var proj = getProjById(projId);
  var strHtml = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="close-modal" data-dismiss="modal">
            <div class="lr">
              <div class="rl"></div>
            </div>
          </div>
          <div class="container">
            <div class="row">
              <div class="col-lg-8 mx-auto">
                <div class="modal-body">
                  <!-- Project Details Go Here -->
                  <h2>${proj.name}</h2>
                  <p class="item-intro text-muted">
                    Lorem ipsum dolor sit amet consectetur.
                  </p>
                  <img
                    class="img-fluid d-block mx-auto"
                    src="${proj.imgSrc}"
                    alt=""
                  />
                  <p>
                    Use this area to describe your project. Lorem ipsum dolor
                    sit amet, consectetur adipisicing elit. Est blanditiis
                    dolorem culpa incidunt minus dignissimos deserunt repellat
                    aperiam quasi sunt officia expedita beatae cupiditate,
                    maiores repudiandae, nostrum, reiciendis facere nemo!
                  </p>
                  <button class="btn btn-info" onclick="window.open('${proj.url}')">Check it out</button>
                  <ul class="list-inline">
                    <li>Date: January 2017</li>
                    <li>Client: Threads</li>
                    <li>Category: Illustration</li>
                  </ul>
                  <button
                    class="btn btn-primary"
                    data-dismiss="modal"
                    type="button"
                  >
                    <i class="fa fa-times"></i>
                    Close Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
 `;

  var elModal = document.querySelector('.modal');
  elModal.innerHTML = strHtml;
}
