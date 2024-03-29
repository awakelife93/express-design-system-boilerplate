import config from "@/config";
import {
  connectMongo,
  createExpress,
  createRoute,
  createServer,
  generateTestData,
  initializeSentry,
} from "@/lib";
import AppRepository from "@/repository";
import { generateConfigLog } from "@/utils";
import { Application } from "express";

class App {
  private readonly server: Application = createExpress();

  private onInitializeSentry(): void {
    console.log("App Initialize Sentry");
    initializeSentry(this.server);
  }

  private onCreateRoute(): void {
    console.log("App Created Route");
    createRoute(this.server);
  }

  private onCreateServer(): void {
    console.log("App Created Server");
    createServer(this.server);
  }

  private async onConnectDB(): Promise<void> {
    console.log("App Connected DB");
    await connectMongo();
  }

  private async onConnectRepository(): Promise<void> {
    console.log("App Connected Repository");
    AppRepository.connect();
  }

  private async onCreateTestSample(): Promise<void> {
    console.log("App Created Test Data");
    await generateTestData();
  }

  private async onCreateLocalHostApp(): Promise<void> {
    await this.onConnectDB();
    await this.onConnectRepository();
    await this.onCreateRoute();
    await this.onCreateServer();

    if (config.isSetUpTestData) {
      await this.onCreateTestSample();
    }
  }

  // * localhost환경과 달라야 할 경우 확장
  private onCreateDevelopmentApp = this.onCreateLocalHostApp;

  private async onCreateProductionApp(): Promise<void> {
    await this.onInitializeSentry();
    await this.onConnectDB();
    await this.onConnectRepository();
    await this.onCreateRoute();
    await this.onCreateServer();
  }

  private getApplication(): Function {
    const applications = {
      production: () => this.onCreateProductionApp(),
      development: () => this.onCreateDevelopmentApp(),
      localhost: () => this.onCreateLocalHostApp(),
    };

    // * default localhost
    return applications[config.NODE_ENV];
  }

  async startApplication(): Promise<void> {
    try {
      generateConfigLog();
      const application = this.getApplication();
      await application();
    } catch (error: unknown) {
      console.log(error);
    }
  }
}

export default new App();
