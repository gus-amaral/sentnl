const express = require('express');
const { Pool } = require('pg');
const crypto = require('crypto');

require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const { Resend } = require('resend');
const part1 = 're_NxAqHpCy'; 
const part2 = '_ATxKTt8RRKBSdQpDcpEsEZpu';      

const resendApiKey = process.env.RESEND_API_KEY || (part1 + part2);
const resend = new Resend(resendApiKey);

// 👉 Place BASE_URL right here with your other config constants. Update ENV to https://sentnl.tech later
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Shared Header Component with Centered White Menu Links
const renderHeader = (isLoggedIn = false) => `
    <header class="w-full px-6 md:px-12 py-2 flex justify-between items-center">
        <a href="/"><img src="/logo_dark_background.png" alt="Sentnl Logo" class="h-20 object-contain" /></a>
        <nav class="flex items-center gap-8 mx-auto">
            <a href="/how-it-works" class="text-base font-medium text-white hover:text-indigo-400 transition-colors">How it works</a>
            <a href="/pricing" class="text-base font-medium text-white hover:text-indigo-400 transition-colors">Pricing</a>
            <a href="/privacy-terms" class="text-base font-medium text-white hover:text-indigo-400 transition-colors">Privacy & Terms</a>
            <a href="/contact" class="text-base font-medium text-white hover:text-indigo-400 transition-colors">Contact</a>
        </nav>
        ${isLoggedIn 
            ? `<form action="/logout" method="POST" class="m-0"><button type="submit" class="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer border border-slate-700">Sign Out</button></form>`
            : `<a href="/login" class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-lg shadow-indigo-600/25">Sign In</a>`
        }
    </header>
`;

// 1. Landing Page (Home - Repositioned for Agencies & Client-Facing Builders)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sentnl - AI Workflow & Client Retainer Watcher</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <!-- Google tag (gtag.js) -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-5HQ8Q06EF6"></script>
            <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5HQ8Q06EF6');
            </script>
        </head>
        <body class="bg-[#0E1626] text-slate-100 font-sans antialiased flex flex-col justify-between min-h-screen m-0">
            ${renderHeader()}

            <!-- Hero Content -->
            <div class="max-w-4xl mx-auto px-6 py-8 text-center my-auto">
                <span class="inline-block bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-sm px-4 py-1.5 rounded-full mb-4 font-semibold">
                    Built for AI Agencies, Freelancers, & Automation Builders
                </span>
                <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                    Protect Your Client Retainers From Silent AI Failures.
                </h1>
                <p class="text-base md:text-lg text-slate-400 mb-8 max-w-xl mx-auto">
                    When your client's automated AI workflows break or return empty responses, you shouldn't have to find out from an angry email. Catch soft failures instantly before your reputation takes a hit.
                </p>

                <form action="/signup" method="POST" class="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-6">
                    <input 
                        type="email" 
                        name="email" 
                        required 
                        placeholder="Enter your work email..." 
                        class="bg-[#131d31] border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-4 py-3 rounded-lg text-slate-100 outline-none flex-1 text-sm"
                    />
                    <button 
                        type="submit" 
                        class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-lg shadow-indigo-600/25 text-sm"
                    >
                        Get My Webhook URL
                    </button>
                </form>
                
                <!-- Free Tier Messaging -->
                <div class="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-2 rounded-full text-xs font-semibold mb-10">
                    <span>✨ Free Tier: Monitor up to 500 client transactions/month • No credit card required</span>
                </div>

                <!-- Sub-Hero Value Pillars Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-left text-xs max-w-3xl mx-auto">
                    <div class="bg-[#131d31] p-4 rounded-xl border border-slate-800 shadow-lg">
                        <div class="text-indigo-400 font-bold text-sm mb-1">🛡️ Built for Client Deliverables</div>
                        <p class="text-slate-400 leading-relaxed">Keep client retainers running smoothly without spending hours building custom monitoring scripts.</p>
                    </div>
                    <div class="bg-[#131d31] p-4 rounded-xl border border-slate-800 shadow-lg">
                        <div class="text-indigo-400 font-bold text-sm mb-1">🚨 Instant Client-Risk Alerts</div>
                        <p class="text-slate-400 leading-relaxed">Catch empty blocks, token limits, and LLM "no-apologies" refusals before your client notices a dip.</p>
                    </div>
                    <div class="bg-[#131d31] p-4 rounded-xl border border-slate-800 shadow-lg">
                        <div class="text-indigo-400 font-bold text-sm mb-1">⏱️ 5-minute Setup</div>
                        <p class="text-slate-400 leading-relaxed">Paste a single webhook at the end of your AI workflow (Make, Zapier, n8n etc). No extra database required.</p>
                    </div>
                </div>
            </div>

            <div class="py-2"></div>
        </body>
        </html>
    `);
});

// 2. How It Works Page
app.get('/how-it-works', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>How It Works - Sentnl</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-[#0E1626] text-slate-100 font-sans antialiased flex flex-col justify-between min-h-screen m-0">
            ${renderHeader()}

            <main class="w-full max-w-4xl mx-auto px-6 py-4">
                <div class="bg-[#131d31] border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl">
                    <h1 class="text-3xl md:text-4xl font-extrabold mb-4 text-center">How Sentnl Works</h1>
                    
                    <p class="text-slate-300 text-base leading-relaxed mb-8 text-center max-w-2xl mx-auto">
                        Sentnl sits quietly at the very end of your automated pipelines—whether you use Zapier, Make, n8n, or custom API scripts. Sentnl inspects every transaction in real time and alerts you instantly.
                    </p>

                    <h3 class="text-indigo-400 font-semibold text-lg mt-6 mb-4">The 3-Step Setup Process</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-base mb-8">
                        <div class="bg-[#0e1626] p-6 rounded-xl border border-slate-800">
                            <strong class="text-indigo-400 block mb-2 font-semibold text-lg">1. Get Your Endpoint</strong>
                            Enter your work email on the home page to instantly generate your unique secure webhook URL.
                        </div>
                        <div class="bg-[#0e1626] p-6 rounded-xl border border-slate-800">
                            <strong class="text-indigo-400 block mb-2 font-semibold text-lg">2. Drop Into Workflow</strong>
                            Add an HTTP POST request action as the final step of your automation, passing your AI text output in the body.
                        </div>
                        <div class="bg-[#0e1626] p-6 rounded-xl border border-slate-800">
                            <strong class="text-indigo-400 block mb-2 font-semibold text-lg">3. Automated Vigilance</strong>
                            We monitor for empty blocks or soft failures and email you immediately if a fix is required.
                        </div>
                    </div>

                    <h3 class="text-indigo-400 font-semibold text-lg mt-6 mb-4">What We Detect & Catch</h3>
                    <ul class="list-disc pl-6 text-slate-300 text-base space-y-3 mb-8">
                        <li><strong class="text-white">Empty / Missing Outputs:</strong> Instantly catches cases where your LLM returns a blank response or the target text field is missing.</li>
                        <li><strong class="text-white">AI Refusal Patterns ("No-Apologies" Rule):</strong> Automatically scans text responses for common model guardrail failures, software limits, or safety refusals (e.g., phrases like <em>"As an AI..."</em>, <em>"I am unable to fulfill..."</em>, token limits exceeded, or API errors).</li>
                        <li><strong class="text-white">Instant Alerting:</strong> Triggers an immediate notification email containing the exact payload and error message so you can diagnose issues quickly.</li>
                    </ul>

                    <h3 class="text-indigo-400 font-semibold text-lg mt-6 mb-3">Built for Reliability</h3>
                    <p class="text-slate-300 text-base leading-relaxed">
                        Our free tier supports up to 500 transactions per month with no expiration date and zero credit card requirements. Upgrade paths are available as your automation infrastructure scales.
                    </p>
                </div>
            </main>

            <div class="py-2"></div>
        </body>
        </html>
    `);
});

// 3. Pricing Page
app.get('/pricing', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Pricing - Sentnl</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-[#0E1626] text-slate-100 font-sans antialiased flex flex-col justify-between min-h-screen m-0">
            ${renderHeader()}

            <main class="w-full max-w-5xl mx-auto px-6 py-8">
                <div class="text-center mb-12">
                    <h1 class="text-3xl md:text-4xl font-extrabold mb-3">Simple, Transparent Pricing</h1>
                    <p class="text-slate-400 text-base max-w-xl mx-auto">
                        Protect your client retainers and automation pipelines with reliable AI output monitoring. Scale as you grow.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Free Tier -->
                    <div class="bg-[#131d31] border border-slate-800 rounded-2xl p-8 flex flex-col justify-between shadow-xl">
                        <div>
                            <div class="text-indigo-400 font-bold text-sm uppercase tracking-wider mb-2">Free</div>
                            <div class="text-4xl font-extrabold mb-4">$0 <span class="text-slate-400 text-sm font-normal">/mo</span></div>
                            <p class="text-slate-400 text-sm mb-6">Ideal for testing and single workflows.</p>
                            <ul class="space-y-3 text-sm text-slate-300 mb-8">
                                <li class="flex items-center gap-2">✓ Up to 500 /mo</li>
                                <li class="flex items-center gap-2">✓ Single webhook monitor</li>
                                <li class="flex items-center gap-2">✓ Email notification</li>
                            </ul>
                        </div>
                        <a href="/" class="block text-center bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-colors text-sm">
                            Get Started Free
                        </a>
                    </div>

                    <!-- Agency Tier -->
                    <div class="bg-[#131d31] border-2 border-indigo-500 rounded-2xl p-8 flex flex-col justify-between shadow-2xl relative">
                        <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Most Popular
                        </div>
                        <div>
                            <div class="text-indigo-400 font-bold text-sm uppercase tracking-wider mb-2">Agency</div>
                            <div class="text-4xl font-extrabold mb-4">$29 <span class="text-slate-400 text-sm font-normal">/mo</span></div>
                            <p class="text-slate-400 text-sm mb-6">For freelancers and agencies managing multiple clients.</p>
                            <ul class="space-y-3 text-sm text-slate-300 mb-8">
                                <li class="flex items-center gap-2">✓ Up to 10,000 /mo (pooled)</li>
                                <li class="flex items-center gap-2">✓ Multiple webhook monitors</li>
                                <li class="flex items-center gap-2">✓ Email notification</li>
                                <li class="flex items-center gap-2">$5 per additional 1,000 transactions</li>
                            </ul>
                        </div>
                        <form action="/create-checkout-session" method="POST">
                            <input type="hidden" name="plan" value="agency" />
                            <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-colors text-sm shadow-lg shadow-indigo-600/25 cursor-pointer">
                                Choose Agency
                            </button>
                        </form>
                    </div>

                    <!-- Scale Tier -->
                    <div class="bg-[#131d31] border border-slate-800 rounded-2xl p-8 flex flex-col justify-between shadow-xl">
                        <div>
                            <div class="text-indigo-400 font-bold text-sm uppercase tracking-wider mb-2">Scale</div>
                            <div class="text-4xl font-extrabold mb-4">$79 <span class="text-slate-400 text-sm font-normal">/mo</span></div>
                            <p class="text-slate-400 text-sm mb-6">For high-volume production operations.</p>
                            <ul class="space-y-3 text-sm text-slate-300 mb-8">
                                <li class="flex items-center gap-2">✓ Unlimited transactions</li>
                                <li class="flex items-center gap-2">✓ Multiple webhook monitors</li>
                                <li class="flex items-center gap-2">✓ Email notification</li>
                                <li class="flex items-center gap-2">✓ Slack integration</li>
                            </ul>
                        </div>
                        <form action="/create-checkout-session" method="POST">
                            <input type="hidden" name="plan" value="scale" />
                            <button type="submit" class="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-colors text-sm cursor-pointer">
                                Choose Scale
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <div class="py-2"></div>
        </body>
        </html>
    `);
});

// 4. Privacy & Terms Page
app.get('/privacy-terms', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Privacy Policy - Sentnl</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-[#0E1626] text-slate-100 font-sans antialiased flex flex-col justify-between min-h-screen m-0">
            ${renderHeader()}

            <main class="w-full max-w-4xl mx-auto px-6 py-4">
                <div class="bg-[#131d31] border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl space-y-6">
                    <div>
                        <h1 class="text-3xl md:text-4xl font-extrabold mb-2">Privacy Policy</h1>
                        <p class="text-slate-400 text-sm">Last updated: September 29, 2026</p>
                    </div>
                    
                    <p class="text-slate-300 text-base leading-relaxed">
                        Sentnl ("Sentnl," "we," "us," or "our") provides AI workflow monitoring and alerting services through sentnl.tech. This Privacy Policy explains what information we collect, how we use it, and how we handle information sent to Sentnl through our service.
                    </p>

                    <section class="space-y-3">
                        <h3 class="text-indigo-400 font-semibold text-xl">1. Information We Collect</h3>
                        <p class="text-slate-300 text-base leading-relaxed">We collect information necessary to provide and improve Sentnl, including:</p>
                        <ul class="list-disc pl-6 text-slate-300 text-base space-y-2">
                            <li><strong class="text-white">Email address:</strong> When you create a Sentnl webhook, we collect the email address you provide. We use it to send monitoring and alert notifications, provide service-related communications, and respond to support requests.</li>
                            <li><strong class="text-white">Webhook data:</strong> When you send information to a Sentnl webhook, we may temporarily process and store the data contained in the webhook request in order to monitor your workflow and determine whether an alert should be generated. You are responsible for ensuring that information sent to Sentnl is appropriate for the service and does not contain information that you are not authorized to share.</li>
                        </ul>
                    </section>

                    <section class="space-y-3">
                        <h3 class="text-indigo-400 font-semibold text-xl">2. How We Use Information</h3>
                        <p class="text-slate-300 text-base leading-relaxed">We use collected information to:</p>
                        <ul class="list-disc pl-6 text-slate-300 text-base space-y-1">
                            <li>Provide and operate Sentnl</li>
                            <li>Monitor workflow outputs and generate alerts</li>
                            <li>Maintain and secure the service</li>
                            <li>Troubleshoot technical issues</li>
                            <li>Respond to support requests</li>
                            <li>Understand service usage and improve the product</li>
                            <li>Comply with applicable legal obligations</li>
                        </ul>
                        <p class="text-slate-300 text-base leading-relaxed pt-2"><strong class="text-white">We do not sell your personal information.</strong></p>
                    </section>

                    <section class="space-y-3">
                        <h3 class="text-indigo-400 font-semibold text-xl">3. Webhook Data</h3>
                        <p class="text-slate-300 text-base leading-relaxed">
                            Sentnl is designed to monitor data generated by your workflows. Depending on how you configure your workflow, webhook requests may contain information originating from your systems or users. Sentnl processes this information only as necessary to provide the monitoring service. Do not send sensitive personal information, passwords, authentication credentials, payment information, or other information that you are not authorized to transmit to Sentnl. You remain responsible for the data you choose to send to your Sentnl webhook.
                        </p>
                    </section>

                    <section class="space-y-3">
                        <h3 class="text-indigo-400 font-semibold text-xl">4. Data Retention</h3>
                        <p class="text-slate-300 text-base leading-relaxed">
                            We retain information only for as long as reasonably necessary to provide the service, maintain security, resolve issues, and meet legal requirements. Webhook data may be retained temporarily for monitoring, troubleshooting, and service operation. Retention periods may change as the product evolves. We may retain limited account or transaction records for longer where required by law or necessary to maintain business records.
                        </p>
                    </section>

                    <section class="space-y-3">
                        <h3 class="text-indigo-400 font-semibold text-xl">5. Service Providers</h3>
                        <p class="text-slate-300 text-base leading-relaxed">
                            We may use third-party infrastructure and service providers to operate Sentnl, such as hosting, email delivery, analytics, monitoring, and other technical services. These providers may process information on our behalf and are expected to use appropriate safeguards for the information they process.
                        </p>
                    </section>

                    <section class="space-y-3">
                        <h3 class="text-indigo-400 font-semibold text-xl">6. Security</h3>
                        <p class="text-slate-300 text-base leading-relaxed">
                            We take reasonable technical and organizational measures to protect information processed through Sentnl. However, no internet-based service can guarantee absolute security. You should not send information to Sentnl that requires a level of security or confidentiality that the service is not designed to provide.
                        </p>
                    </section>

                    <section class="space-y-3">
                        <h3 class="text-indigo-400 font-semibold text-xl">7. Your Choices</h3>
                        <p class="text-slate-300 text-base leading-relaxed">
                            You can stop using a Sentnl webhook at any time. If you want to request access to, correction of, or deletion of personal information associated with your use of Sentnl, contact us using the information below.
                        </p>
                    </section>

                    <section class="space-y-3">
                        <h3 class="text-indigo-400 font-semibold text-xl">8. Children's Privacy</h3>
                        <p class="text-slate-300 text-base leading-relaxed">
                            Sentnl is not intended for children under the age of 13, and we do not knowingly collect personal information from children under 13.
                        </p>
                    </section>

                    <section class="space-y-3">
                        <h3 class="text-indigo-400 font-semibold text-xl">9. International Data Transfers</h3>
                        <p class="text-slate-300 text-base leading-relaxed">
                            Sentnl and its service providers may process information in countries other than the country where you are located. Where applicable, we take reasonable steps to ensure that information is handled in accordance with applicable privacy requirements.
                        </p>
                    </section>

                    <section class="space-y-3">
                        <h3 class="text-indigo-400 font-semibold text-xl">10. Changes to This Policy</h3>
                        <p class="text-slate-300 text-base leading-relaxed">
                            We may update this Privacy Policy as Sentnl develops or as applicable privacy requirements change. When we make material changes, we will update the "Last updated" date at the top of this page.
                        </p>
                    </section>

                    <section class="space-y-3">
                        <h3 class="text-indigo-400 font-semibold text-xl">11. Contact Us</h3>
                        <p class="text-slate-300 text-base leading-relaxed">If you have questions about this Privacy Policy or how Sentnl handles information, contact us at:</p>
                        <p class="text-indigo-400 text-base font-semibold">
                            <a href="mailto:contact@sentnl.tech" class="hover:underline">contact@sentnl.tech</a>
                        </p>
                    </section>
                </div>
            </main>

            <div class="py-2"></div>
        </body>
        </html>
    `);
});

// 5. Contact Page
app.get('/contact', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contact Us - Sentnl</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <!-- Google tag (gtag.js) -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-5HQ8Q06EF6"></script>
            <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5HQ8Q06EF6');
            </script>
        </head>
        <body class="bg-[#0E1626] text-slate-100 font-sans antialiased flex flex-col justify-between h-screen m-0 overflow-hidden">
            ${renderHeader()}

            <div class="max-w-md w-full mx-auto text-center bg-[#0E1626] border border-slate-800 p-8 rounded-2xl shadow-xl my-auto px-6">
                <h1 class="text-3xl md:text-4xl font-extrabold mb-4">Get in Touch</h1>
                <p class="text-slate-400 text-base mb-6">
                    Have questions, feature requests, or need help integrating a webhook into your workflow? Reach out to us directly at:
                </p>
                <a href="mailto:contact@sentnl.tech" class="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg shadow-indigo-600/25 text-base mb-6">
                    contact@sentnl.tech
                </a>
            </div>

            <div class="py-2"></div>
        </body>
        </html>
    `);
});

// 6. Signup Endpoint (Handles user creation, default monitor, and onboarding email)
app.post('/signup', async (req, res) => {
    const { email } = req.body;

    try {
        const userQuery = `
            INSERT INTO users (email, tier) 
            VALUES ($1, 'free') 
            ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
            RETURNING id, email;
        `;
        const userResult = await pool.query(userQuery, [email]);
        const user = userResult.rows[0];

        let monitorQuery = `SELECT monitors.*, users.email, users.id as user_id, users.tier, users.webhook_count, users.last_reset_at, users.limit_email_sent 
                            FROM monitors 
                            JOIN users ON monitors.user_id = users.id 
                            WHERE monitors.webhook_secret = $1;`;
        let monitorResult = await pool.query(monitorQuery, [user.id]);
        let monitor = monitorResult.rows[0];

        if (!monitor) {
            const createMonitorQuery = `
                INSERT INTO monitors (user_id, name, rule_type, target_field) 
                VALUES ($1, 'Default Pipeline Monitor', 'no_apologies', 'output')
                RETURNING *;
            `;
            const newMonitorRes = await pool.query(createMonitorQuery, [user.id]);
            monitor = newMonitorRes.rows[0];
        }

        const webhookUrl = `${BASE_URL}/webhook/${monitor.webhook_secret}`;

        // Send onboarding email
        await resend.emails.send({
            from: 'Sentnl Alerts <alerts@sentnl.tech>',
            to: email,
            subject: 'Your Sentnl Webhook URL & Setup Guide',
            html: `
                <div style="font-family: sans-serif; max-width: 550px; margin: auto; padding: 24px; background: #0e1626; color: #f8fafc; border-radius: 8px;">
                    <h2 style="color: #818cf8; margin-top: 0;">Your Sentnl Endpoint 🚀</h2>
                    <p>You're ready to start monitoring. Drop this webhook URL at the very end of your AI automation workflow:</p>
                    
                    <div style="background: #131d31; padding: 12px 16px; border-radius: 6px; border: 1px solid #334155; font-family: monospace; word-break: break-all; color: #38bdf8; margin: 16px 0;">
                        ${webhookUrl}
                    </div>

                    <p style="font-size: 14px; color: #cbd5e1;"><strong>Current Rule:</strong> Alerts if the <code>output</code> field is empty or triggers AI refusal patterns (<code>no_apologies</code>).</p>
                </div>
            `
        });

        // Notify support inbox
        await resend.emails.send({
            from: 'Sentnl Alerts <alerts@sentnl.tech>',
            to: 'contact@sentnl.tech',
            subject: 'New User Signup on Sentnl',
            html: `
                <div style="font-family: sans-serif; max-width: 550px; margin: auto; padding: 24px; background: #0e1626; color: #f8fafc; border-radius: 8px;">
                    <h2 style="color: #818cf8; margin-top: 0;">New Signup 🚀</h2>
                    <p>A new user just requested their webhook URL:</p>
                    <div style="background: #131d31; padding: 12px 16px; border-radius: 6px; border: 1px solid #334155; font-family: monospace; color: #38bdf8; margin: 16px 0;">
                        ${email}
                    </div>
                </div>
            `
        });

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-[#0E1626] text-slate-100 flex flex-col justify-between h-screen m-0 overflow-hidden">
                ${renderHeader()}

                <div class="max-w-md w-full mx-auto text-center bg-[#131d31] border border-slate-800 p-8 rounded-2xl shadow-xl my-auto px-6">
                    <div class="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">✓</div>
                    <h2 class="text-4xl font-bold mb-2">Webhook URL Sent!</h2>
                    <p class="text-slate-400 text-base mb-6">We've generated your unique endpoint and emailed it directly to <strong>${email}</strong>.</p>
                    <a href="/" class="text-indigo-400 hover:text-indigo-300 text-sm font-medium">&larr; Back to Home</a>
                </div>

                <div class="py-2"></div>
            </body>
            </html>
        `);
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).send('Error creating monitor or sending email.');
    }
});

// 7. CORE WEBHOOK VALIDATION ENGINE
app.post('/webhook/:secret', async (req, res) => {
    const { secret } = req.params;
    const payload = req.body;

    try {
        const monitorQuery = `
            SELECT monitors.*, users.email, users.id as user_id, users.tier, users.webhook_count, users.last_reset_at, users.limit_email_sent
            FROM monitors 
            JOIN users ON monitors.user_id = users.id 
            WHERE monitors.webhook_secret = $1;
        `;
        const monitorResult = await pool.query(monitorQuery, [secret]);
        
        if (monitorResult.rows.length === 0) {
            return res.status(404).json({ error: 'Monitor not found or invalid secret.' });
        }

        const monitor = monitorResult.rows[0];

        // Monthly lazy reset check
        const now = new Date();
        const lastReset = new Date(monitor.last_reset_at);

        if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
            await pool.query(
                'UPDATE users SET webhook_count = 0, limit_email_sent = FALSE, last_reset_at = NOW() WHERE id = $1',
                [monitor.user_id]
            );
            monitor.webhook_count = 0;
            monitor.limit_email_sent = false;
        }

        // Free Tier Limit (500 limit)
        const FREE_LIMIT = 500;
        if (monitor.tier === 'free' && monitor.webhook_count >= FREE_LIMIT) {
            if (!monitor.limit_email_sent) {
                await resend.emails.send({
                    from: 'Sentnl Alerts <alerts@sentnl.tech>',
                    to: monitor.email,
                    subject: `⚠️ Action Required: Sentnl Free Tier Limit Reached`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 550px; margin: auto; padding: 24px; background: #0e1626; color: #f8fafc; border-radius: 8px; border: 1px solid #f59e0b;">
                            <h2 style="color: #f59e0b; margin-top: 0;">Free Tier Limit Reached 🛑</h2>
                            <p>Your Sentnl pipeline monitor <strong>${monitor.name}</strong> has reached the 500 webhook calls limit for this month.</p>
                        </div>
                    `
                });

                await pool.query(
                    'UPDATE users SET limit_email_sent = TRUE WHERE id = $1',
                    [monitor.user_id]
                );
            }

            return res.status(429).json({ 
                error: 'Free tier limit reached (500/500). Please upgrade to continue receiving alerts.' 
            });
        }

        await pool.query(
            'UPDATE users SET webhook_count = webhook_count + 1 WHERE id = $1',
            [monitor.user_id]
        );

        const targetField = monitor.target_field || 'output';
        const ruleType = monitor.rule_type || 'not_empty';
        const fieldValue = payload[targetField];

        let status = 'success';
        let errorMessage = null;

        if (ruleType === 'not_empty') {
            const isEmpty = fieldValue === undefined || fieldValue === null || String(fieldValue).trim() === '';
            if (isEmpty) {
                status = 'failed';
                errorMessage = `Validation failed: Field '${targetField}' was empty or missing.`;
            }
        } 
        else if (ruleType === 'no_apologies') {
            const textValue = String(fieldValue || '').toLowerCase();
            const refusalPatterns = [
                /\bsor+y\b/i,
                /apolog(?:y|ies|ize|izing)/i,
                /\b(?:i\s+)?can(?:'?t|\s+not)\b/i,
                /\b(?:i\s+)?could(?:'?t|\s+not)\b/i,
                /\b(?:i\s+)?am\s+unable\b/i,
                /\bas\s+an\s+ai\b/i,
                /policy\s+restrictions?/i,
                /safety\s+guidelines?/i,
                /\bapi\s+error\b/i,
                /invalid\s+json/i
            ];
            
            const matchedPattern = refusalPatterns.find(regex => regex.test(textValue));
            
            if (matchedPattern) {
                status = 'failed';
                errorMessage = `Soft failure detected: Output matched LLM refusal pattern (${matchedPattern}).`;
            } else if (fieldValue === undefined || fieldValue === null || String(fieldValue).trim() === '') {
                status = 'failed';
                errorMessage = `Validation failed: Field '${targetField}' was empty or missing.`;
            }
        }

        const logQuery = `
            INSERT INTO logs (monitor_id, status, payload_received, error_message) 
            VALUES ($1, $2, $3, $4);
        `;
        await pool.query(logQuery, [monitor.id, status, JSON.stringify(payload), errorMessage]);

        if (status === 'failed') {
            await resend.emails.send({
                from: 'Sentnl Alerts <alerts@sentnl.tech>',
                to: monitor.email,
                subject: `🚨 Alert: AI Soft Failure Caught on "${monitor.name}"`,
                html: `
                    <div style="font-family: sans-serif; max-width: 550px; margin: auto; padding: 24px; background: #0e1626; color: #f8fafc; border-radius: 8px; border: 1px solid #ef4444;">
                        <h2 style="color: #ef4444; margin-top: 0;">AI Quality Guardrail Triggered ⚠️</h2>
                        <p>${errorMessage}</p>
                    </div>
                `
            });
        }

        return res.status(200).json({ status: 'received', validation: status, rule: ruleType });

    } catch (err) {
        console.error('Webhook processing error:', err);
        return res.status(500).json({ error: 'Internal server error processing webhook.' });
    }
});

// 8. Login Page
app.get('/login', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sign In - Sentnl</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-[#0E1626] text-slate-100 font-sans antialiased flex flex-col justify-between h-screen m-0 overflow-hidden">
            ${renderHeader()}

            <div class="max-w-md w-full mx-auto text-center bg-[#0E1626] border border-slate-800 p-8 rounded-2xl shadow-xl my-auto px-6">
                <h1 class="text-4xl font-extrabold mb-2">Sign In to Sentnl</h1>
                <p class="text-slate-400 text-base mb-6">
                    Enter your work email and we'll send you a secure magic sign-in link. No password required.
                </p>

                <form action="/login" method="POST" class="flex flex-col gap-3">
                    <input 
                        type="email" 
                        name="email" 
                        required 
                        placeholder="Enter your work email..." 
                        class="bg-[#131d31] border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-4 py-3 rounded-lg text-slate-100 outline-none text-sm"
                    />
                    <button 
                        type="submit" 
                        class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-lg shadow-indigo-600/25 text-base"
                    >
                        Send Magic Sign-In Link
                    </button>
                </form>                
            </div>

            <div class="py-2"></div>
        </body>
        </html>
    `);
});

// 9. Handle Magic Link Request
app.post('/login', async (req, res) => {
    const { email } = req.body;

    try {
        const userResult = await pool.query('SELECT id, email FROM users WHERE email = $1', [email]);
        
        // Even if user doesn't exist, show a success message to prevent email enumeration attacks
        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];
            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

            await pool.query(
                'INSERT INTO magic_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
                [user.id, token, expiresAt]
            );

            const loginUrl = `${BASE_URL}/auth/confirm?token=${token}`;

            await resend.emails.send({
                from: 'Sentnl Alerts <alerts@sentnl.tech>',
                to: email,
                subject: 'Your Sentnl Sign-In Link',
                html: `
                    <div style="font-family: sans-serif; max-width: 550px; margin: auto; padding: 24px; background: #0e1626; color: #f8fafc; border-radius: 8px;">
                        <h2 style="color: #818cf8; margin-top: 0;">Sign In to Sentnl 🔑</h2>
                        <p>Click the secure button below to log into your Sentnl account. This link expires in 15 minutes.</p>
                        
                        <a href="${loginUrl}" style="display: inline-block; background: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 16px 0;">
                            Sign In Now
                        </a>
                    </div>
                `
            });
        }

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-[#0E1626] text-slate-100 flex flex-col justify-between h-screen m-0 overflow-hidden">
                ${renderHeader()}

                <div class="max-w-md w-full mx-auto text-center bg-[#131d31] border border-slate-800 p-8 rounded-2xl shadow-xl my-auto px-6">
                    <div class="w-12 h-12 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">✉️</div>
                    <h2 class="text-2xl font-bold mb-2">Check Your Inbox</h2>
                    <p class="text-slate-400 text-sm mb-6">If an account exists for <strong>${email}</strong>, we've sent a secure magic sign-in link.</p>
                    <a href="/login" class="text-indigo-400 hover:text-indigo-300 text-sm font-medium">&larr; Back to Sign In</a>
                </div>

                <div class="py-2"></div>
            </body>
            </html>
        `);
    } catch (err) {
        console.error('Login request error:', err);
        res.status(500).send('Error generating login link.');
    }
});

// Helper to parse cookies easily without extra packages
function parseCookies(req) {
    const list = {};
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return list;
    cookieHeader.split(';').forEach(cookie => {
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return list;
}

// 10a. Neutral Confirmation Page (Safe from email scanners)
app.get('/auth/confirm', async (req, res) => {
    const { token, plan } = req.query;
    if (!token) {
        return res.status(400).send('Missing login token.');
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirm Sign-In - Sentnl</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-[#0E1626] text-slate-100 font-sans antialiased flex flex-col justify-between h-screen m-0">
            ${renderHeader()}

            <div class="max-w-md w-full mx-auto text-center bg-[#131d31] border border-slate-800 p-8 rounded-2xl shadow-xl my-auto px-6">
                <div class="w-12 h-12 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">🔐</div>
                <h2 class="text-2xl font-bold mb-2">Almost Logged In</h2>
                <p class="text-slate-400 text-sm mb-6">Click the button below to verify your session and open your agency dashboard.</p>
                
                <form action="/auth/verify" method="POST">
                    <input type="hidden" name="token" value="${token}" />
                    <input type="hidden" name="plan" value="${plan || ''}" />
                    <button 
                        type="submit" 
                        class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-lg shadow-indigo-600/25 text-sm"
                    >
                        Complete Sign In &rarr;
                    </button>
                </form>
            </div>

            <div class="py-2"></div>
        </body>
        </html>
    `);
});


// 11. Agency Dashboard Route
app.get('/dashboard', async (req, res) => {
    const cookies = parseCookies(req);
    const sessionToken = cookies.sentnl_session;

    if (!sessionToken) {
        return res.redirect('/login');
    }

    try {
        // Authenticate session
        const sessionResult = await pool.query(
            `SELECT users.* FROM sessions 
             JOIN users ON sessions.user_id = users.id 
             WHERE sessions.session_token = $1 AND sessions.expires_at > NOW()`,
            [sessionToken]
        );

        if (sessionResult.rows.length === 0) {
            return res.redirect('/login');
        }

        const user = sessionResult.rows[0];

        // LOCAL TESTING FALLBACK: If redirected back with ?upgrade=success, upgrade instantly
        if (req.query.upgrade === 'success') {
            const upgradedPlan = req.query.plan === 'scale' ? 'scale' : 'agency';
            await pool.query("UPDATE users SET tier = $1 WHERE id = $2", [upgradedPlan, user.id]);
            user.tier = upgradedPlan; // update local object for immediate render
            console.log(`Local fallback: Upgraded user ${user.id} to ${upgradedPlan} tier!`);
        }

        // Fetch all monitors for this user
        const monitorsResult = await pool.query(
            'SELECT * FROM monitors WHERE user_id = $1 ORDER BY id DESC',
            [user.id]
        );
        const monitors = monitorsResult.rows.rows || monitorsResult.rows;

        const tierLimits = { free: 500, agency: 10000, scale: 50000 };
        const maxLimit = tierLimits[user.tier] || 500;
        const usagePercent = Math.min(Math.round((user.webhook_count / maxLimit) * 100), 100);

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Dashboard - Sentnl</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-[#0E1626] text-slate-100 font-sans antialiased flex flex-col justify-between min-h-screen m-0">
                
                ${renderHeader(true)} <!-- Pass true here so it displays "Sign Out" -->
                
                <main class="max-w-4xl w-full mx-auto px-6 py-8 my-auto">
                    <!-- Top Bar: Account & Tier -->
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#131d31] border border-slate-800 p-6 rounded-2xl shadow-xl mb-6 gap-4">
                        <div>
                            <span class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Logged in as</span>
                            <div class="text-lg font-bold text-white">${user.email}</div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="text-right">
                                <span class="text-xs uppercase tracking-wider text-slate-400 font-semibold block">Current Plan</span>
                                <span class="inline-block bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                    ${user.tier} Tier
                                </span>
                            </div>
                           ${user.tier === 'free' ? `
                                <a 
                                    href="/pricing" 
                                    class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors shadow-lg shadow-indigo-600/25 cursor-pointer inline-block"
                                >
                                    Upgrade Plan
                                </a>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Usage Pool Progress Box -->
                    <div class="bg-[#131d31] border border-slate-800 p-6 rounded-2xl shadow-xl mb-6">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm font-semibold text-slate-300">Pooled Monthly Transactions</span>
                            <span class="text-sm font-bold text-indigo-400">${user.webhook_count} / ${maxLimit.toLocaleString()} used</span>
                        </div>
                        <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                            <div class="bg-indigo-500 h-2.5 rounded-full" style="width: ${usagePercent}%"></div>
                        </div>
                    </div>

                    <!-- Add Monitor Form -->
                    <div class="bg-[#131d31] border border-slate-800 p-6 rounded-2xl shadow-xl mb-6">
                        <h3 class="text-lg font-bold mb-3 text-indigo-400">+ Create New Client Monitor</h3>
                        <form action="/monitors" method="POST" class="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input 
                                type="text" 
                                name="name" 
                                required 
                                placeholder="Client / Workflow Name (e.g. Acme Lead Bot)" 
                                class="bg-[#0E1626] border border-slate-800 focus:border-indigo-500 px-4 py-2.5 rounded-lg text-slate-100 outline-none text-sm md:col-span-2"
                            />
                            <button 
                                type="submit" 
                                class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer shadow-lg shadow-indigo-600/25 text-sm"
                            >
                                Generate Webhook
                            </button>
                        </form>
                    </div>

                    <!-- Monitors List -->
                    <div class="bg-[#131d31] border border-slate-800 p-6 rounded-2xl shadow-xl">
                        <h3 class="text-lg font-bold mb-4 text-white">Your Active Client Monitors (${monitors.length})</h3>
                        ${monitors.length === 0 ? `
                            <p class="text-slate-400 text-sm">No monitors created yet. Add your first client workflow above!</p>
                        ` : `
                            <div class="space-y-3">
                                ${monitors.map(m => `
                                    <div class="bg-[#0E1626] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                                        <div>
                                            <div class="font-bold text-white text-sm mb-1">${m.name}</div>
                                            <div class="text-xs font-mono text-indigo-400 bg-[#131d31] px-3 py-1.5 rounded border border-slate-800 select-all">
                                                ${BASE_URL}/webhook/${m.webhook_secret}
                                            </div>
                                        </div>
                                        <span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-semibold">
                                            Active
                                        </span>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>
                </main>

                <div class="py-2"></div>
            </body>
            </html>
        `);

    } catch (err) {
        console.error('Dashboard error:', err);
        res.status(500).send('Error loading dashboard.');
    }
});

// 12. Create New Monitor Route
app.post('/monitors', async (req, res) => {
    const cookies = parseCookies(req);
    const sessionToken = cookies.sentnl_session;

    if (!sessionToken) {
        return res.redirect('/login');
    }

    const { name } = req.body;

    try {
        const sessionResult = await pool.query(
            'SELECT user_id FROM sessions WHERE session_token = $1 AND expires_at > NOW()',
            [sessionToken]
        );

        if (sessionResult.rows.length === 0) {
            return res.redirect('/login');
        }

        const userId = sessionResult.rows[0].user_id;
        const secret = crypto.randomBytes(16).toString('hex');

        await pool.query(
            'INSERT INTO monitors (user_id, name, webhook_secret, rule_type, target_field) VALUES ($1, $2, $3, $4, $5)',
            [userId, name, secret, 'no_apologies', 'output']
        );

        res.redirect('/dashboard');
    } catch (err) {
        console.error('Create monitor error:', err);
        res.status(500).send('Error creating monitor.');
    }
});

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// 13. Create Stripe Checkout Session for Tier Upgrade
app.post('/create-checkout-session', async (req, res) => {
    const cookies = parseCookies(req);
    const sessionToken = cookies.sentnl_session;
    const plan = req.body.plan || 'agency';

    if (!sessionToken) {
        // Send them to our pricing auth bridge to collect email & send magic link!
        return res.redirect(`/pricing/auth?plan=${plan}`);
    }

    try {
        const sessionResult = await pool.query(
            `SELECT users.* FROM sessions 
             JOIN users ON sessions.user_id = users.id 
             WHERE sessions.session_token = $1 AND sessions.expires_at > NOW()`,
            [sessionToken]
        );

        if (sessionResult.rows.length === 0) {
            return res.redirect('/login');
        }

        const user = sessionResult.rows[0];

       // 1. Dynamically select the correct Price ID based on the form submission
        const priceId = plan === 'scale' 
            ? process.env.STRIPE_SCALE_PRICE_ID 
            : process.env.STRIPE_AGENCY_PRICE_ID;

        // 2. Pass the variable into Stripe instead of the hardcoded string
        const stripeSession = await stripe.checkout.sessions.create({
            customer_email: user.email,
            line_items: [
                {
                    price: priceId, // <--- Using the variable here!
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${BASE_URL}/dashboard?upgrade=success&plan=${plan}`,
            cancel_url: `${BASE_URL}/pricing?upgrade=canceled`,
            metadata: {
                user_id: user.id,
                plan: plan
            }
        });

        res.redirect(303, stripeSession.url);

    } catch (err) {
        console.error('Stripe checkout error:', err);
        res.status(500).send('Error initiating checkout session.');
    }
});

// 14. Stripe Webhook to Automatically Upgrade User Tier
app.post('/webhook/stripe', express.json(), async (req, res) => {
    const event = req.body;

    if (event.type === 'checkout.session.completed') {
        const stripeSession = event.data.object;
        const userId = stripeSession.metadata.user_id;
        
        // Dynamically pull the plan from metadata, defaulting to 'agency' only if nothing is specified
        const plan = stripeSession.metadata.plan === 'scale' ? 'scale' : 'agency';

        if (userId) {
            try {
                await pool.query(
                    "UPDATE users SET tier = $1 WHERE id = $2",
                    [plan, userId]
                );
                console.log(`Successfully upgraded user ${userId} to ${plan} tier via Stripe!`);
            } catch (dbErr) {
                console.error('Database update error during Stripe webhook:', dbErr);
            }
        }
    }

    res.json({ received: true });
});

// 15a. Pricing Auth Bridge Form (Handles GET requests from logged-out users choosing a paid tier)
app.get('/pricing/auth', (req, res) => {
    const plan = req.query.plan || 'agency';
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Continue to Checkout - Sentnl</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-[#0E1626] text-slate-100 font-sans antialiased flex flex-col justify-between h-screen m-0 overflow-hidden">
            ${renderHeader()}

            <div class="max-w-md w-full mx-auto text-center bg-[#131d31] border border-slate-800 p-8 rounded-2xl shadow-xl my-auto px-6">
                <span class="inline-block bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-3 py-1 rounded-full mb-3 font-semibold uppercase">
                    ${plan} Tier Selected
                </span>
                <h1 class="text-2xl font-extrabold mb-2">Enter your work email to continue</h1>
                <p class="text-slate-400 text-sm mb-6">
                    We'll quickly set up your account or sign you in, then send you a secure link straight to checkout.
                </p>

                <form action="/pricing/auth" method="POST" class="flex flex-col gap-3">
                    <input type="hidden" name="plan" value="${plan}" />
                    <input 
                        type="email" 
                        name="email" 
                        required 
                        placeholder="Enter your work email..." 
                        class="bg-[#0E1626] border border-slate-800 focus:border-indigo-500 px-4 py-3 rounded-lg text-slate-100 outline-none text-sm"
                    />
                    <button 
                        type="submit" 
                        class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-lg shadow-indigo-600/25 text-sm"
                    >
                        Send Secure Sign-In Link &rarr;
                    </button>
                </form>                
            </div>

            <div class="py-2"></div>
        </body>
        </html>
    `);
});

// 15b. Pricing Auth Bridge (Handles logged-out users wanting to buy a paid plan)
app.post('/pricing/auth', async (req, res) => {
    const { email, plan } = req.body;

    try {
        // Ensure user exists (auto-create if brand new, just like regular signup)
        let userResult = await pool.query('SELECT id, email FROM users WHERE email = $1', [email]);
        let user;

        if (userResult.rows.length > 0) {
            user = userResult.rows[0];
        } else {
            const userQuery = `
                INSERT INTO users (email, tier) 
                VALUES ($1, 'free') 
                RETURNING id, email;
            `;
            const newUserRes = await pool.query(userQuery, [email]);
            user = newUserRes.rows[0];

            const createMonitorQuery = `
                INSERT INTO monitors (user_id, name, rule_type, target_field) 
                VALUES ($1, 'Default Pipeline Monitor', 'no_apologies', 'output')
                RETURNING *;
            `;
            await pool.query(createMonitorQuery, [user.id]);
        }

        // Generate magic token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await pool.query(
            'INSERT INTO magic_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
            [user.id, token, expiresAt]
        );

        // Include the plan in the confirmation/verify URL!
        const loginUrl = `${BASE_URL}/auth/confirm?token=${token}&plan=${plan}`;

        // Send the sign-in email
        await resend.emails.send({
            from: 'Sentnl Alerts <alerts@sentnl.tech>',
            to: email,
            subject: 'Sign In to Complete Your Sentnl Upgrade',
            html: `
                <div style="font-family: sans-serif; max-width: 550px; margin: auto; padding: 24px; background: #0e1626; color: #f8fafc; border-radius: 8px;">
                    <h2 style="color: #818cf8; margin-top: 0;">Complete Your Upgrade 🔑</h2>
                    <p>Click the secure button below to sign in and proceed directly to your <strong>${plan}</strong> tier checkout. This link expires in 15 minutes.</p>
                    
                    <a href="${loginUrl}" style="display: inline-block; background: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 16px 0;">
                        Sign In & Checkout Now
                    </a>
                </div>
            `
        });

        // Show confirmation screen that the email was sent
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-[#0E1626] text-slate-100 flex flex-col justify-between h-screen m-0 overflow-hidden">
                ${renderHeader()}

                <div class="max-w-md w-full mx-auto text-center bg-[#131d31] border border-slate-800 p-8 rounded-2xl shadow-xl my-auto px-6">
                    <div class="w-12 h-12 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">✉️</div>
                    <h2 class="text-2xl font-bold mb-2">Check Your Inbox</h2>
                    <p class="text-slate-400 text-sm mb-6">We've sent a secure sign-in link to <strong>${email}</strong> to complete your ${plan} tier upgrade.</p>
                    <a href="/login" class="text-indigo-400 hover:text-indigo-300 text-sm font-medium">&larr; Back to Login</a>
                </div>

                <div class="py-2"></div>
            </body>
            </html>
        `);
    } catch (err) {
        console.error('Pricing auth error:', err);
        res.status(500).send('Error processing checkout authentication.');
    }
});


// ==========================================
// REQUEST ROUTE (Handles Sign-up & Login)
// ==========================================
app.post('/auth/magic-link', async (req, res) => {
    const { email, plan } = req.body;

    if (!email) {
        return res.status(400).send('Email is required.');
    }

    try {
        // Step A: Check if user already exists
        let userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        let user;

        if (userResult.rows.length === 0) {
            // Step B: If user doesn't exist, create them in the database!
            const newUserResult = await pool.query(
                'INSERT INTO users (email, created_at) VALUES ($1, NOW()) RETURNING *',
                [email]
            );
            user = newUserResult.rows[0];
            console.log(`Created new user: ${email} (ID: ${user.id})`);
        } else {
            user = userResult.rows[0];
            console.log(`Found existing user: ${email} (ID: ${user.id})`);
        }

        // Step C: Generate a secure random token
        const token = crypto.randomBytes(32).toString('hex');
        
        // Step D: Set expiration (15 minutes from now)
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        // Step E: Store the magic token linked to the user_id
        await pool.query(
            'INSERT INTO magic_tokens (user_id, token, expires_at, used) VALUES ($1, $2, $3, FALSE)',
            [user.id, token, expiresAt]
        );

        // Step F: Build the magic link URL
        const magicLink = `http://localhost:3000/auth/verify?token=${token}${plan ? `&plan=${plan}` : ''}`;
        
        // TODO: Replace this `console.log` with your actual email sender (e.g., Nodemailer, SendGrid, Resend)
        console.log(`👉 Magic link for ${email}: ${magicLink}`);

        // Step G: Respond to the frontend
        return res.status(200).send('Check your email for the login link.');

    } catch (err) {
        console.error('Error generating magic link:', err);
        return res.status(500).send('Internal server error.');
    }
});


// ==========================================
//  VERIFICATION ROUTE (Logs the User In)
// ==========================================
app.all('/auth/verify', async (req, res) => {
    const token = req.method === 'POST' ? req.body.token : req.query.token;
    const plan = req.method === 'POST' ? req.body.plan : req.query.plan;

    if (!token) {
        return res.status(400).send('Missing login token.');
    }

    try {
        // Find the token in the database
        const tokenResult = await pool.query(
            'SELECT * FROM magic_tokens WHERE token = $1 AND used = FALSE',
            [token]
        );

        if (tokenResult.rows.length === 0) {
            return res.status(400).send(`
                <!DOCTYPE html>
                <html lang="en">
                <head><script src="https://cdn.tailwindcss.com"></script></head>
                <body class="bg-[#0E1626] text-slate-100 flex items-center justify-center h-screen m-0">
                    <div class="text-center bg-[#131d31] border border-slate-800 p-8 rounded-2xl max-w-md">
                        <h2 class="text-xl font-bold text-red-400 mb-2">Link Expired or Invalid</h2>
                        <p class="text-slate-400 text-sm mb-4">This magic link has already been used or is invalid.</p>
                        <a href="/login" class="text-indigo-400 hover:underline text-sm font-medium">Request a new link</a>
                    </div>
                </body>
                </html>
            `);
        }

        const magicToken = tokenResult.rows[0];

        // Check expiration in JavaScript to avoid database timezone issues
        if (new Date(magicToken.expires_at) < new Date()) {
            return res.status(400).send(`
                <!DOCTYPE html>
                <html lang="en">
                <head><script src="https://cdn.tailwindcss.com"></script></head>
                <body class="bg-[#0E1626] text-slate-100 flex items-center justify-center h-screen m-0">
                    <div class="text-center bg-[#131d31] border border-slate-800 p-8 rounded-2xl max-w-md">
                        <h2 class="text-xl font-bold text-red-400 mb-2">Link Expired</h2>
                        <p class="text-slate-400 text-sm mb-4">This magic link has expired (15-minute limit).</p>
                        <a href="/login" class="text-indigo-400 hover:underline text-sm font-medium">Request a new link</a>
                    </div>
                </body>
                </html>
            `);
        }

        // Mark token as used
        await pool.query('UPDATE magic_tokens SET used = TRUE WHERE id = $1', [magicToken.id]);

        // Create session token (30 days)
        const sessionToken = crypto.randomBytes(32).toString('hex');
        const sessionExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await pool.query(
            'INSERT INTO sessions (user_id, session_token, expires_at) VALUES ($1, $2, $3)',
            [magicToken.user_id, sessionToken, sessionExpires]
        );

        res.cookie('sentnl_session', sessionToken, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        // Redirect based on plan or go to dashboard
        if (plan && (plan === 'agency' || plan === 'scale')) {
            return res.redirect(307, `/create-checkout-session?plan=${plan}`);
        } else {
            return res.redirect('/dashboard');
        }

    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(500).send('Internal server error during authentication.');
    }
});

// 16. Logout Route (Deletes session from DB and clears cookie)
app.post('/logout', async (req, res) => {
    const cookies = parseCookies(req);
    const sessionToken = cookies.sentnl_session;

    if (sessionToken) {
        try {
            // Delete the session record from the database
            await pool.query('DELETE FROM sessions WHERE session_token = $1', [sessionToken]);
        } catch (err) {
            console.error('Error deleting session during logout:', err);
        }
    }

    // Clear the session cookie from the browser
    res.clearCookie('sentnl_session');
    
    // Redirect user back to home page
    return res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});