// Function to change the background color of the body
function changeBackgroundColor() {
    const colorPicker = document.getElementById('color-picker');
    const selectedColor = colorPicker.value;
    document.body.style.backgroundColor = selectedColor;
}
document.getElementById('change-color-btn').addEventListener('click', changeBackgroundColor);
