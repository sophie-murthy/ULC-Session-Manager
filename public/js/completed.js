document.addEventListener('DOMContentLoaded', () => {
    const modalButtons = document.querySelectorAll('.eval-button');
    const modals = document.querySelectorAll('.modal');
    const closes = document.querySelectorAll('.close');

    modalButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            modals[index].showModal();
        });
    });

    closes.forEach((close, index) => {
        close.addEventListener('click', () => {
            modals[index].close();
        });
    });
});
