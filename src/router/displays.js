

let displayList = [{
    id: 0,
    name: 'Е-Банк',
    img: require('@/assets/displays/ebank.png'),
    description: 'Банк, в котором Васян держит основные сбережения',
    component: 'e-bank'
}, {
    id: 1,
    name: 'Стиль-Банк',
    img: require('@/assets/displays/styleBank.png'),
    description: 'Банк, в котором Васян взял кредит, т.к. там ему одобрили минимальную ставку',
    component: 'style-bank'
}, {
    id: 2,
    name: 'СМС',
    img: require('@/assets/displays/sms.png'),
    description: 'смски на телефоне Васяна',
    component: 'sms'
}, {
    id: 3,
    name: 'Монополия',
    img: require('@/assets/displays/monopoly.png'),
    description: 'Васян может выбирать здесь различные продукты',
    component: 'monopoly'
}
];

export default displayList;
