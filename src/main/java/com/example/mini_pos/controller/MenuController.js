$('#menu-section').css('display', 'block');
$('#customer').css('display', 'none');
$('#item').css('display', 'none');
$('#order').css('display', 'none');
$('#place_order').css('display', 'none');

$('#home-nav').on('click', () => {
    event.preventDefault();
    $('#menu-section').css('display', 'block');
    $('#customer').css('display', 'none');
    $('#item').css('display', 'none');
    $('#order').css('display', 'none');
    $('#place_order').css('display', 'none');
})

$('.customer-nav').on('click', () => {
    event.preventDefault();
    $('#menu-section').css('display', 'none');
    $('#customer').css('display', 'block');
    $('#item').css('display', 'none');
    $('#order').css('display', 'none');
    $('#place_order').css('display', 'none');
})


$('.item-nav').on('click', () => {
    event.preventDefault();
    $('#menu-section').css('display', 'none');
    $('#customer').css('display', 'none');
    $('#item').css('display', 'block');
    $('#order').css('display', 'none');
    $('#place_order').css('display', 'none');
})


$('.order-nav').on('click', () => {
    event.preventDefault();
    $('#menu-section').css('display', 'none');
    $('#customer').css('display', 'none');
    $('#item').css('display', 'none');
    $('#order').css('display', 'block');
    $('#place_order').css('display', 'none');
})
$('.orderDetail-nav').on('click', () => {
    event.preventDefault();
    $('#menu-section').css('display', 'none');
    $('#customer').css('display', 'none');
    $('#item').css('display', 'none');
    $('#order').css('display', 'none');
    $('#place_order').css('display', 'block');
})