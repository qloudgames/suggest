import * as React from 'react';
import { Link } from 'react-router-dom';
import styles from './component_util.module.css';

export const InlineSeparator = () => <span style={{ color: 'black', textDecoration: 'bold' }}>&nbsp;|&nbsp;</span>;

export const StyledLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <Link to={to} className={styles.link}>{children}</Link>
);;
