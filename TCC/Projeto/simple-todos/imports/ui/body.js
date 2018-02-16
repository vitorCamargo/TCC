import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating'; 
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
        Meteor.subscribe('tasks');
});

Template.body.helpers({
    tasks() {
        const instance = Template.instance();
        
        if (instance.state.get('hideCompleted')) {
            // Filtrar se as anotações estiverem escondidas
            return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
        }
        // Retorna todas as anotações
        return Tasks.find({}, { sort: { createdAt: -1 } });
    },
    incompleteCount() {
        return Tasks.find({ checked: { $ne: true } }).count();
    },
});

Template.body.events({
    'submit .new-task'(event) {
        event.preventDefault();
 
        // Pegar o valor do elemento
        const target = event.target;
        const texto = target.text.value;
 
        // Inserir uma anotação na coleção
        Meteor.call('tasks.insert', texto);
 
        // Limpar formulário
        target.text.value = '';
    },
    'change .hide-completed input'(event, instance) {
        instance.state.set('hideCompleted', event.target.checked);
    },
});