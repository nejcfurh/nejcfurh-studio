'use client';

import emailjs from '@emailjs/browser';
import { JSX, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import SectionHeading from '@/app/components/SectionHeading';

const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const serviceId = process.env.NEXT_PUBLIC_MAILJS_SERVICE_ID;
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

const toastStyle = {
  border: '1px solid rgba(96, 134, 190, 0.3)',
  borderRadius: '12px',
  padding: '16px 20px',
  color: '#fafafa',
  background: 'rgba(17, 17, 17, 0.95)',
  backdropFilter: 'blur(12px)',
};

const Contact = (): JSX.Element => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateId || !serviceId || !publicKey) return;
    setLoading(true);

    if (!form.name || !form.email || !form.message) {
      setLoading(false);
      return toast.error('Please fill in all fields.', {
        duration: 1500,
        style: toastStyle,
        iconTheme: { primary: '#ef4444', secondary: '#fafafa' },
      });
    }

    emailjs
      .send(
        serviceId,
        templateId,
        {
          from_name: form.name,
          to_name: 'Nejc',
          from_email: form.email,
          to_email: 'nejc.furh7@gmail.com',
          message: form.message,
        },
        publicKey,
      )
      .then(
        () => {
          setLoading(false);
          toast.success('Message sent successfully!', {
            duration: 2000,
            style: toastStyle,
            iconTheme: { primary: '#22c55e', secondary: '#fafafa' },
          });
          setForm({ name: '', email: '', message: '' });
        },
        error => {
          setLoading(false);
          console.error(error);
          toast.error('Something went wrong. Please try again.', {
            duration: 1500,
            style: toastStyle,
            iconTheme: { primary: '#ef4444', secondary: '#fafafa' },
          });
        },
      );
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      <div className="gradient-orb gradient-orb-accent w-[400px] h-[400px] hidden sm:block -top-[150px] -right-[150px] absolute" />

      <span className="hash-span">&nbsp;</span>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeading label="Get in Touch" title="Contact." />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-secondary leading-relaxed mb-8 max-w-md">
              Have a project in mind or want to collaborate? I&apos;d love to
              hear from you. Drop me a message and I&apos;ll get back to you as
              soon as possible.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Send size={16} className="text-accent" />
                </div>
                <span className="text-secondary text-sm">
                  nejc.furh7@gmail.com
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right - form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="glass-card p-8 space-y-6"
            >
              <div>
                <label
                  htmlFor="name"
                  className="text-white-100 text-sm font-medium block mb-2"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="form-input"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="text-white-100 text-sm font-medium block mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="form-input"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="text-white-100 text-sm font-medium block mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  className="form-input resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="magnetic-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
