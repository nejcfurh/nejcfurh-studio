export interface Job {
  job_id: string;
  job_title: string;
  job_description: string;
  job_employment_type: string;
  job_country: string;
  job_google_link: string;
  employer_name: string;
  employer_logo: string | null;
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
  };
}
