import { RequisicoesHTTP } from '../../services/httpbase.service.js';
import { LoginUser } from '../../class/user-model.js';
import { LogData } from '../../class/logdata-model.js';
import { DatabaseService } from '../../services/database.service.js';

const requisicoes = new RequisicoesHTTP();
const UserData = new LoginUser();
const databaseService = new DatabaseService();

let logoutButton = document.getElementById("button-logout");
let AccessToken = localStorage.getItem('AccessToken');

if (logoutButton != null) {
    logoutButton?.addEventListener("click", async (event) => {
        // Impede o envio padrão do formulário
        event.preventDefault();
        logoutButton.classList.add('is-loading');
        AccessToken = localStorage.getItem('AccessToken');
        let response = await requisicoes.post('/auth/signout', {});
        if (response.Status) {
            localStorage.removeItem('AccessToken');
            let logData = new LogData("Usuário deslogado com sucesso e AccessToken removido do Local Storage!", AccessToken)
            databaseService.insertData(logData)
        } else {
            alert(response)
        }
        logoutButton.classList.remove('is-loading');  
        hideCentralStatusPanel();
    })
}

//todo: ajustar template do options

function showCentralStatusPanel() {
    let container = document.getElementById('company-info');
    container[0].style.display = 'none';
    container[1].style.display = 'flex';
}

function hideCentralStatusPanel() {
    let container = document.getElementById('company-info');
    container[0].style.display = 'flex';
    container[1].style.display = 'none';
}

/*! components.js | Huro | Css Ninja. 2020-2021 */

/* ==========================================================================
Auth pages js
========================================================================== */

"use strict";

//Init Pageloader
initPageLoader();

$(document).ready(function () {
    if (env === "development") {
        //Change demo images
        changeDemoImages();
    }

    feather.replace();

    //Dark Mode
    initDarkMode();

    //Regular Modals
    initAnimatedModals();

    //Login submission
    $("#login-submit").on("click", function () {
        var $this = $(this);
        $this.addClass("is-loading");
        setTimeout(function () {
            $this.removeClass("is-loading");
            $("#login-form").submit();
        }, 1000);
    });

    //Reset password
    $("#forgot-link, #cancel-recover").on("click", function () {
        $(this)
            .closest(".is-form")
            .find("form, .form-text")
            .toggleClass("is-hidden");
    });

    //Signup Flow
    if ($("#huro-signup").length) {
        //Steps
        $(".step-icon").on("click", function () {
            var targetStep = $(this).attr("data-step");
            var progressValue = $(this).attr("data-progress");
            $(this).prevAll().addClass("is-done");
            $(this).removeClass("is-done").addClass("is-active");
            $(this).nextAll().removeClass("is-active is-done");
            $("#signup-steps-progress").val(progressValue);
            if (targetStep !== undefined) {
                $(".signup-columns").addClass("is-hidden");
                $("#" + targetStep).removeClass("is-hidden");
                $(".avatar-carousel").slick("setPosition");
                $(".card-bg").addClass("faded");
            }

            if (targetStep == "signup-step-1") {
                $(".card-bg").removeClass("faded");
            }
        });

        //Step 1 confirmation
        $("#confirm-step-1").on("click", function () {
            var $this = $(this);
            $this.addClass("is-loading");
            setTimeout(function () {
                $this.removeClass("is-loading");
                $(".card-bg").addClass("faded");
                $(".signup-steps").removeClass("is-hidden");
                $("#signup-step-1, #signup-step-2").toggleClass("is-hidden");
                $(".avatar-carousel").slick("setPosition");
            }, 1000);
        });

        //Avatar carousel selector
        if ($(".avatar-carousel").length) {
            var carousel = $(".avatar-carousel");

            carousel.on("init", function () {
                feather.replace();
            });

            carousel.on("afterChange", function () {
                var currentAvatarUrl = $(".avatar-carousel")
                    .find(".slick-current img")
                    .attr("src");
                $(".picture-selector .image-container img").attr(
                    "src",
                    currentAvatarUrl
                );
                $("#confirm-step-2").removeClass("is-disabled");
            });

            $(".avatar-carousel").slick({
                centerMode: true,
                dots: false,
                infinite: true,
                centerPadding: "100px",
                prevArrow:
                    "<div class='slick-custom is-prev'><i data-feather='chevron-left'></i></div>",
                nextArrow:
                    "<div class='slick-custom is-next'><i data-feather='chevron-right'></i></div>",
                slidesToShow: 3,
            });

            //Go to next avatar/skill when clicking on it
            $(".slick-slider").on("click", ".slick-slide", function (e) {
                e.stopPropagation();
                var index = $(this).data("slick-index");
                if ($(".slick-slider").slick("slickCurrentSlide") !== index) {
                    $(".slick-slider").slick("slickGoTo", index);
                }
            });
        }

        //Uploader
        FilePond.registerPlugin(
            FilePondPluginImagePreview,
            FilePondPluginImageExifOrientation,
            FilePondPluginFileValidateSize,
            FilePondPluginImageEdit
        );

        FilePond.create(document.querySelector(".signup-filepond"), {
            labelIdle: `<i class="lnil lnil-cloud-upload"></>`,
            imagePreviewHeight: 140,
            imageCropAspectRatio: "1:1",
            imageResizeTargetWidth: 140,
            imageResizeTargetHeight: 140,
            stylePanelLayout: "compact circle",
            styleLoadIndicatorPosition: "center bottom",
            styleProgressIndicatorPosition: "right bottom",
            styleButtonRemoveItemPosition: "left bottom",
            styleButtonProcessItemPosition: "right bottom",
        });

        const pond = document.querySelector(".signup-filepond");
        pond.addEventListener("FilePond:addfile", (e) => {
            console.log("File added", e.detail);
            const button = document.getElementById("signup-profile-upload");
            button.classList.remove("is-disabled");
        });

        //Step 2 confirmation
        $("#confirm-step-2").on("click", function () {
            var $this = $(this);
            $this.addClass("is-loading");
            setTimeout(function () {
                $this.removeClass("is-loading");
                //Activate step
                $(".step-icon:nth-child(2)")
                    .removeClass("is-inactive")
                    .trigger("click");
            }, 1000);
        });

        //Go to onboarding
        $("#finish-signup").on("click", function () {
            var $this = $(this);
            $this.addClass("is-loading");
            $(".step-icon.is-inactive").removeClass("is-inactive").trigger("click");
            setTimeout(function () {
                $this.removeClass("is-loading");
                window.location.href = "/admin-dashboards-personal-1.html";
            }, 1400);
        });
    }
});