const path_apps = '/home/website/www/blindtus-apps';
const path_logs = '/home/website/pm2_logs';

module.exports = {
  apps: [
    {
      name: 'Blindtus_WEB',
      script: 'npm',
      cwd: `${path_apps}/web`,
      args: 'run start',
      env_production: {
        PORT: 3400,
        NODE_ENV: 'production',
        NEXT_PUBLIC_DATABASE_MODE: 'prod',
      },

      // Logging
      out_file: `${path_logs}/Blindtus_ADMIN_out.log`,
      error_file: `${path_logs}/Blindtus_ADMIN_error.log`,
      merge_logs: false,
      log_date_format: 'DD-MM HH:mm:ss Z',
      log_type: 'json',
    },
  ],
};
