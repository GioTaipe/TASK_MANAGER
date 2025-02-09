<template>
    <section class="dots-container">
        <div class="dot">W</div>
        <div class="dot">E</div>
        <div class="dot">L</div>
        <div class="dot">C</div>
        <div class="dot">O</div>
        <div class="dot">M</div>
        <div class="dot">E</div>
    </section>
</template>

<script>
export default {
    name: 'SplashScreen',
};
</script>

<style scoped>
@keyframes pulse {
    0% {
        transform: scale(0.8);
        background-color: #e0ebe2;
        box-shadow: 0 0 0 0 rgba(224, 235, 226, 0.7);
    }
    50% {
        transform: scale(1.3);
        background-color: #a8c4ad;
        box-shadow: 0 0 20px rgba(168, 196, 173, 0.7);
    }
    100% {
        transform: scale(0.8);
        background-color: #e0ebe2;
        box-shadow: 0 0 0 0 rgba(224, 235, 226, 0.7);
    }
}

.dots-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap; /* NO permite que los círculos pasen a otra línea */
    gap: 1.5vw; /* Espaciado dinámico */
    min-height: 100vh; /* Ocupa toda la pantalla */
    overflow: hidden; /* Evita desbordamientos */
    padding: 2vw;
    width: 100%;
}

.dot {
    width: 12vw; /* Tamaño dinámico */
    height: 12vw;
    max-width: 120px;
    max-height: 120px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 4vw;
    font-weight: bold;
    color: #2e5543;
    text-transform: uppercase;
    animation: pulse 2.5s infinite alternate ease-in-out;
}

/* RESPONSIVE: Reduce tamaño en pantallas pequeñas para que quepa en una fila */
@media (max-width: 768px) {
    .dot {
        width: 10vw;
        height: 10vw;
        font-size: 3.5vw;
    }
    .dots-container {
        gap: 1vw;
    }
}

@media (max-width: 480px) {
    .dot {
        width: 8vw;
        height: 8vw;
        font-size: 3vw;
    }
    .dots-container {
        gap: 0.8vw;
    }
}

@media (max-width: 360px) {
    .dot {
        width: 7vw;
        height: 7vw;
        font-size: 2.8vw;
    }
    .dots-container {
        gap: 0.5vw;
    }
}
</style>
