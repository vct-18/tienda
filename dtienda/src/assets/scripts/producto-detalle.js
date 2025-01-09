// detalle_producto.js
import { productos } from './productos.js';

document.addEventListener('DOMContentLoaded', () => {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const idProducto = getQueryParam('id');
    const slugProducto = getQueryParam('slug');
    const artNoSpan = document.getElementById('art-no');
    const mainImage = document.getElementById('main-image');
    const thumbnailContainer = document.getElementById('thumbnail-container');
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const additionalInfoList = document.getElementById('additional-info');
    const careInfoList = document.getElementById('care-info');
    const productSpecs = document.getElementById('product-specs');
    const colorContainer = document.getElementById('color-container');
    const selectedColor = document.getElementById('selected-color');
    const leftNav = document.getElementById('left-nav');
    const rightNav = document.getElementById('right-nav');

    if (!artNoSpan || !mainImage || !thumbnailContainer || !productName || !productPrice || !additionalInfoList || !careInfoList || !productSpecs || !colorContainer || !selectedColor || !leftNav || !rightNav) {
        console.error('Uno o más elementos no encontrados en el DOM.');
        return;
    }

    if (!idProducto && !slugProducto) {
        artNoSpan.textContent = "ID o slug de producto no especificado";
        artNoSpan.style.color = "red";
        return;
    }

    let producto;
    if (idProducto) {
        const idProductoNum = parseInt(idProducto, 10);
        if (!isNaN(idProductoNum)) {
            producto = productos.find(p => p.id === idProductoNum);
        }
    }

    if (!producto && slugProducto) {
        producto = productos.find(p => p.slug === slugProducto);
    }

    if (producto) {
        artNoSpan.textContent = producto.artNo || "Número de artículo no disponible";
        artNoSpan.style.color = producto.artNo ? "" : "orange";

        // Configurar imagen principal
        if (producto.imagenes && producto.imagenes.length > 0) {
            mainImage.src = producto.imagenes[0];
            mainImage.alt = `Imagen del Producto ${producto.artNo}`;

            // Agregar miniaturas
            thumbnailContainer.innerHTML = '';
            producto.imagenes.forEach((imgSrc, index) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.dataset.nav = index;
                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = `Galería imagen #${index + 1}`;
                button.appendChild(img);
                thumbnailContainer.appendChild(button);
            });

            // Navegación de imágenes
            let currentIndex = 0;

            function updateImage(index) {
                mainImage.src = producto.imagenes[index];
                mainImage.alt = `Imagen del Producto ${producto.artNo} #${index + 1}`;
                currentIndex = index;
            }

            leftNav.addEventListener('click', () => {
                const newIndex = (currentIndex - 1 + producto.imagenes.length) % producto.imagenes.length;
                updateImage(newIndex);
            });

            rightNav.addEventListener('click', () => {
                const newIndex = (currentIndex + 1) % producto.imagenes.length;
                updateImage(newIndex);
            });

            thumbnailContainer.addEventListener('click', (event) => {
                const button = event.target.closest('button');
                if (button) {
                    const index = parseInt(button.dataset.nav, 10);
                    updateImage(index);
                }
            });
        } else {
            mainImage.src = '';
            mainImage.alt = 'Imagen del Producto No Disponible';
            thumbnailContainer.innerHTML = '<p>No hay imágenes disponibles</p>';
        }

        // Mostrar nombre y precio del producto
        if (productName) {
            productName.textContent = producto.nombre || "Nombre del producto no disponible";
        }

        if (productPrice) {
            productPrice.textContent = producto.precio ? `S/${producto.precio}` : "Precio no disponible";
        }

        // Mostrar opciones de color
        if (colorContainer && producto.colores) {
            colorContainer.innerHTML = '';
            producto.colores.forEach((color, index) => {
                const colorButton = document.createElement('button');
                colorButton.className = 'color-button';
                colorButton.style.backgroundColor = color.codigo;
                colorButton.title = color.nombre;
                colorButton.dataset.color = color.nombre;

                // Marcar el primer color como seleccionado por defecto
                if (index === 0) {
                    colorButton.classList.add('selected');
                    selectedColor.textContent = ` ${color.nombre}`;
                }

                colorContainer.appendChild(colorButton);
            });

            // Añadir evento para seleccionar color
            colorContainer.addEventListener('click', (event) => {
                event.preventDefault(); // Prevenir la redirección
                const button = event.target.closest('.color-button');
                if (button) {
                    // Eliminar clase 'selected' de todos los botones
                    colorContainer.querySelectorAll('.color-button').forEach(btn => btn.classList.remove('selected'));

                    // Añadir clase 'selected' al botón clicado
                    button.classList.add('selected');

                    // Actualizar texto del color seleccionado
                    const selectedColorName = button.dataset.color;
                    selectedColor.textContent = ` ${selectedColorName}`;
                }
            });
        } else {
            colorContainer.innerHTML = '<p>No hay opciones de color disponibles</p>';
        }


        // Mostrar información adicional
        if (additionalInfoList && producto.infoAdicional) {
            additionalInfoList.innerHTML = producto.infoAdicional.map(info => `<li>${info}</li>`).join('');
        }

        // Mostrar información de cuidado
        if (careInfoList && producto.infoCuidado) {
            careInfoList.innerHTML = producto.infoCuidado.map(info =>
                `<li class="media">
                    <img src="${info.icono}" alt="Icono" class="d-block mr-3">
                    <div class="media-body pl-1">${info.texto}</div>
                </li>`
            ).join('');
        }

        // Mostrar especificaciones del producto
        if (productSpecs && producto.especificaciones) {
            productSpecs.textContent = producto.especificaciones;
        }
    } else {
        artNoSpan.textContent = "Producto no encontrado";
        artNoSpan.style.color = "red";
        setTimeout(() => {
            window.location.href = "error.html";
        }, 3000);
    }
});