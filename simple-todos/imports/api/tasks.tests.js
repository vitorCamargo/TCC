import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';
 
import { Tasks } from './tasks.js';
 
if (Meteor.isServer) {
    describe('Tasks', () => {
        describe('methods', () => {
        
            const userId = Random.id();
            let taskId;
 
            beforeEach(() => {
                Tasks.remove({});
                taskId = Tasks.insert({
                    text: 'test task',
                    createdAt: new Date(),
                    owner: userId,
                    username: 'tmeasday',
                });
            });

            it('can delete owned task', () => {

                // Teste isolado
                const deleteTask = Meteor.server.method_handlers['tasks.remove'];

                // Coloca um método falso que parece com aspéctos do método
                const invocation = { userId };

                // Carrega o método com 'this' colocando o método falso
                deleteTask.apply(invocation, [taskId]);

                // Verifica que o método faz aquilo que era esperado
                assert.equal(Tasks.find().count(), 0);
            });
        });     
    });
}