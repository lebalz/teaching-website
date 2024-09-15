import {NavbarItem} from "@docusaurus/theme-common";

const isDev = process.env.NODE_ENV === 'development';

export const GithubNavItem: NavbarItem = {
  href: 'https://github.com/SilasBerger/teaching-website',
  label: 'GitHub',
  position: 'right',
}

export const TaskStateOverviewNavItem: NavbarItem = {
  type: 'custom-taskStateOverview',
  position: 'left'
};


export const AccountSwitcherNavItem: NavbarItem = {
  type: 'custom-accountSwitcher',
    position: 'right'
};

export const LoginProfileNavItem: NavbarItem = {
  type: 'custom-loginProfileButton',
  position: 'right'
};

export const DevDocsNavbarItem: NavbarItem | null = isDev ? {
  to: 'docs',
  label: '📄 Docs',
  position: 'right'
} : null;

export const DevComponentGalleryNavbarItem: NavbarItem | null = isDev ? {
  to: 'docs/material/Components-Gallery/Shared-Components',
  label: '🔧 Components',
  position: 'right'
} : null;