import { ipcMain } from "electron";
import { ActionController } from "../../model/dto/actionController";
import { Controller } from "../../model/dto/controller";

class EventService {
  private registered = false;
  private controllers: Controller[] = [];
  private actions: ActionController[] = [];

  private normalizeControllerName(controller: string) {
    return controller.substring(controller.lastIndexOf('/') + 1, controller.indexOf('.controller.ts'));
  }

  private registerIpcAction(
    action: string,
    method: string,
    controller: object,
  ) {
    // @ts-ignore
    ipcMain.handle(action, (_, ...args: any[]) => controller[method](...args));
  }

  public async registerControllers() {
    if (!this.registered) {
      // @ts-ignore
      const context = import.meta.glob('../controllers/*.controller.ts');

      await Promise.all(
        Object.keys(context).map(async (it: string) => {
          this.controllers.push({
            name: this.normalizeControllerName(it),
            instance: (await context[it]()).default,
          })
        })
      );

      this.controllers.forEach((controller) => {
        const actionController: ActionController = {
          key: controller.name,
          methods: [],
        };

        Object.getOwnPropertyNames(Object.getPrototypeOf(controller.instance))
          .filter((it) => it !== "constructor")
          .forEach((it) => {
            this.registerIpcAction(
              `${controller.name}:${it}`,
              it,
              controller.instance,
            );
            actionController.methods.push(it);
          });

        this.actions.push(actionController);
      });

      this.registered = true;
    }
  }

  public getControllerActions() {
    return this.actions;
  }
}

export default new EventService();
