'use strict';
import apiService from '../services/apiService.js';
import imageListItemsTemplate from '../templates/imageListItems.hbs';
import 'material-design-icons/iconfont/material-icons.css';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/src/styles/main.scss';


import PNotify from 'pnotify/dist/es/PNotify.js';
import 'pnotify/dist/PNotifyBrightTheme.css';
PNotify.defaults.delay = 3000;

const refs = {
    searchForm: document.querySelector('#search-form'),
    galleryItems: document.querySelector('#gallery'),
    btnLoadMore: document.querySelector('.btnLoadMore'),
    body: document.querySelector('body'),
}

refs.searchForm.addEventListener('submit', searchFormSubmit);

function searchFormSubmit(e) {
    e.preventDefault();
    clearImageItems()
    apiService.resetPage();


    const form = e.currentTarget;
    const input = form.elements.query;
    const inputValue = input.value;
    apiService.searchQuery = input.value;

    apiService.fetchImage().then(hits => {
        const marcup = buildImageListItems(hits)
        insertImageItems(marcup)
        refs.btnLoadMore.classList.remove('hiddenBtn');

        if (hits.length >= 12) {
            PNotify.success({
                text: "Удачный HTTP-запрос! Congratulation!!!"
            });
        } else if (hits.length <= 11 && hits.length >= 1) {
            PNotify.error({
                text: "По вашему запросу найдено всего лишь несколько изображений!"
            });
        } else if (hits.length === 0) {
            PNotify.error({
                text: "По Вашему запросу изображений не найдено!"
            });
        }
    })
};

function buildImageListItems(images) {
    return imageListItemsTemplate(images)
};

function insertImageItems(images) {
    refs.galleryItems.insertAdjacentHTML('beforeend', images)
}

function clearImageItems() {
    refs.galleryItems.innerHTML = '';
}

//===========================================работа loadMore button=============
refs.btnLoadMore.addEventListener('click', btnLoadMoreHandler);

function btnLoadMoreHandler(e) {
    apiService.fetchImage().then(hits => {
        const marcup = buildImageListItems(hits)
        insertImageItems(marcup)
        window.scrollBy({
            top: 500,
            behavior: "smooth"
        });
    })
}

//===========================================работа basicLightbox плагина===
refs.body.addEventListener('click', showBigImage);

function showBigImage(e) {
    if (e.target.nodeName === 'IMG') {
        const imageBig = e.target.getAttribute('data-source');
        basicLightbox.create(`
        <img src="${imageBig}">
    `).show()
    }
}