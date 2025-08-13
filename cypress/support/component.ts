// cypress/support/component.ts
import './commands';
import { mount } from 'cypress/react'; // or 'cypress/react' if using React <18
import type { MountOptions, MountReturn } from 'cypress/react';

// Extend Cypress' Command interface for TS IntelliSense
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Mounts a React component for component testing.
       * @param component The React element to mount.
       * @param options Optional mount configuration.
       */
      mount(
        component: React.ReactNode,
        options?: MountOptions
      ): Cypress.Chainable<MountReturn>;
    }
  }
}

// Add the custom "mount" command
Cypress.Commands.add('mount', mount);
