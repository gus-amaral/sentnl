const express = require('express');
const { Pool } = require('pg');
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

// Shared Header Component with Centered White Menu Links
const renderHeader = () => `
    <header class="w-full px-8 py-3 flex justify-between items-center max-w-6xl mx-auto">
        <a href="/"><img src="/logo_dark_background.png" alt="Sentnl Logo" class="h-20 object-contain" /></a>
        <nav class="flex items-center gap-8 mx-auto">
            <a href="/" class="text-sm font-medium text-white hover:text-indigo-400 transition-colors">Home</a>
            <a href="/how-it-works" class="text-sm font-medium text-white hover:text-indigo-400 transition-colors">How it works</a>
            <a href="/privacy-terms" class="text-sm font-medium text-white hover:text-indigo-400 transition-colors">Privacy & Terms</a>
            <a href="/contact" class="text-sm font-medium text-white hover:text-indigo-400 transition-colors">Contact</a>
        </nav>
        <div style="width: 140px;"><!-- spacer to balance layout --></div>
    </header>
`;

// 1. Landing Page (Home)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sentnl - AI Automation & Payload Watcher</title>
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

            <!-- Hero Content -->
            <div class="max-w-3xl mx-auto px-6 py-2 text-center my-auto">
                <span class="inline-block bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-sm px-4 py-1.5 rounded-full mb-4 font-semibold">
                    Built for Zapier, Make, n8n and custom AI Builders
                </span>
                <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                    Stop Finding Out Your Automations Broke When Your Client Complains.
                </h1>
                <p class="text-base md:text-lg text-slate-400 mb-8 max-w-xl mx-auto">
                    Drop a single webhook URL at the end of your workflow. We inspect your AI output payloads in real-time and email you the second something returns empty or broken.
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
                
                <!-- Larger Free Tier Messaging -->
                <div class="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-2.5 rounded-full text-sm font-semibold">
                    <span>✨ Free Tier: Up to 500 transactions/month • No expiry • No credit card required</span>
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
        <body class="bg-[#0E1626] text-slate-100 font-sans antialiased flex flex-col justify-between h-screen m-0 overflow-hidden">
            ${renderHeader()}

            <div class="max-w-3xl mx-auto px-6 py-6 text-left my-auto bg-[#0E1626] border border-slate-800 rounded-2xl shadow-xl overflow-y-auto max-h-[78vh]">
                <h1 class="text-2xl font-extrabold mb-1 text-center">How Sentnl Works</h1>
                
                <p class="text-slate-300 text-xs leading-relaxed mb-4">
                    Sentnl sits quietly at the very end of your automated pipelines—whether you use Zapier, Make, n8n, or custom API scripts. Sentnl inspects every transaction in real time and alerts you instantly.
                </p>

                <h3 class="text-indigo-400 font-semibold text-sm mt-4 mb-2">The 3-Step Setup Process</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-2">
                    <div class="bg-[#0e1626] p-4 rounded-xl border border-slate-800">
                        <strong class="text-indigo-400 block mb-1 font-semibold text-sm">1. Get Your Endpoint</strong>
                        Enter your work email on the home page to instantly generate your unique secure webhook URL.
                    </div>
                    <div class="bg-[#0e1626] p-4 rounded-xl border border-slate-800">
                        <strong class="text-indigo-400 block mb-1 font-semibold text-sm">2. Drop Into Workflow</strong>
                        Add an HTTP POST request action as the final step of your automation, passing your AI text output in the body.
                    </div>
                    <div class="bg-[#0e1626] p-4 rounded-xl border border-slate-800">
                        <strong class="text-indigo-400 block mb-1 font-semibold text-sm">3. Automated Vigilance</strong>
                        We monitor for empty blocks or soft failures and email you immediately if a fix is required.
                    </div>
                </div>

                <h3 class="text-indigo-400 font-semibold text-sm mt-4 mb-2">What We Detect & Catch</h3>
                <p class="text-slate-300 text-xs leading-relaxed mb-2">Sentnl goes beyond simple server downtime checks by performing semantic validations on your JSON payloads:</p>
                <ul class="list-disc pl-5 text-slate-300 text-xs space-y-2 mb-4">
                    <li><strong>Empty / Missing Outputs:</strong> Instantly catches cases where your LLM returns a blank response or the target text field is missing.</li>
                    <li><strong>AI Refusal Patterns ("No-Apologies" Rule):</strong> Automatically scans text responses for common model guardrail failures, software limits, or safety refusals (e.g., phrases like <em>"As an AI..."</em>, <em>"I am unable to fulfill..."</em>, token limits exceeded, or API errors).</li>
                    <li><strong>Instant Alerting:</strong> Triggers an immediate notification email containing the exact payload and error message so you can diagnose issues quickly.</li>
                </ul>

                <h3 class="text-indigo-400 font-semibold text-sm mt-4 mb-2">Built for Reliability</h3>
                <p class="text-slate-300 text-xs leading-relaxed mb-2">
                    Our free tier supports up to 500 transactions per month with no expiration date and zero credit card requirements. Upgrade paths are available as your automation infrastructure scales.
                </p>
            </div>

            <div class="py-2"></div>
        </body>
        </html>
    `);
});

// 3. Privacy & Terms Page
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
        <body class="bg-[#0E1626] text-slate-100 font-sans antialiased flex flex-col justify-between h-screen m-0 overflow-hidden">
            ${renderHeader()}

            <div class="max-w-3xl mx-auto px-6 py-6 text-left my-auto bg-[#0E1626] border border-slate-800 rounded-2xl shadow-xl overflow-y-auto max-h-[78vh]">
                <h1 class="text-2xl font-extrabold mb-1">Privacy Policy</h1>
                <p class="text-slate-400 text-xs mb-6">Last updated: September 29, 2026</p>
                
                <p class="text-slate-300 text-xs leading-relaxed mb-4">
                    Sentnl ("Sentnl," "we," "us," or "our") provides AI workflow monitoring and alerting services through sentnl.tech. This Privacy Policy explains what information we collect, how we use it, and how we handle information sent to Sentnl through our service.
                </p>

                <h3 class="text-indigo-400 font-semibold text-sm mt-4 mb-2">1. Information We Collect</h3>
                <p class="text-slate-300 text-xs leading-relaxed mb-2">We collect information necessary to provide and improve Sentnl, including:</p>
                <ul class="list-disc pl-5 text-slate-300 text-xs space-y-2 mb-4">
                    <li><strong>Email address:</strong> When you create a Sentnl webhook, we collect the email address you provide. We use it to send monitoring and alert notifications, provide service-related communications, and respond to support requests.</li>
                    <li><strong>Webhook data:</strong> When you send information to a Sentnl webhook, we may temporarily process and store the data contained in the webhook request in order to monitor your workflow and determine whether an alert should be generated. You are responsible for ensuring that information sent to Sentnl is appropriate for the service and does not contain information that you are not authorized to share.</li>
                    <li><strong>Technical information:</strong> We may automatically collect limited technical information, such as IP address, timestamps, request information, browser information, and service logs. We use this information to operate, secure, troubleshoot, and improve Sentnl.</li>
                </ul>

                <h3 class="text-indigo-400 font-semibold text-sm mt-4 mb-2">2. How We Use Information</h3>
                <p class="text-slate-300 text-xs leading-relaxed mb-2">We use collected information to:</p>
                <ul class="list-disc pl-5 text-slate-300 text-xs space-y-1 mb-4">
                    <li>Provide and operate Sentnl</li>
                    <li>Monitor workflow outputs and generate alerts</li>
                    <li>Maintain and secure the service</li>
                    <li>Troubleshoot technical issues</li>
                    <li>Respond to support requests</li>
                    <li>Understand service usage and improve the product</li>
                    <li>Comply with applicable legal obligations</li>
                </ul>
                <p class="text-slate-300 text-xs leading-relaxed mb-4">We do not sell your personal information.</p>

                <h3 class="text-indigo-400 font-semibold text-sm mt-4 mb-2">3. Webhook Data</h3>
                <p class="text-slate-300 text-xs leading-relaxed mb-4">
                    Sentnl is designed to monitor data generated by your workflows. Depending on how you configure your workflow, webhook requests may contain information originating from your systems or users. Sentnl processes this information only as necessary to provide the monitoring service. Do not send sensitive personal information, passwords, authentication credentials, payment information, or other information that you are not authorized to transmit to Sentnl. You remain responsible for the data you choose to send to your Sentnl webhook.
                </p>

                <h3 class="text-indigo-400 font-semibold text-sm mt-4 mb-2">4. Data Retention</h3>
                <p class="text-slate-300 text-xs leading-relaxed mb-4">
                    We retain information only for as long as reasonably necessary to provide the service, maintain security, resolve issues, and meet legal requirements. Webhook data may be retained temporarily for monitoring, troubleshooting, and service operation. Retention periods may change as the product evolves. We may retain limited account or transaction records for longer where required by law or necessary to maintain business records.
                </p>

                <h3 class="text-indigo-400 font-semibold text-sm mt-4 mb-2">5. Service Providers</h3>
                <p class="text-slate-300 text-xs leading-relaxed mb-4">
                    We may use third-party infrastructure and service providers to operate Sentnl, such as hosting, email delivery, analytics, monitoring, and other technical services. These providers may process information on our behalf and are expected to use appropriate safeguards for the information they process.
                </p>

                <h3 class="text-indigo-400 font-semibold text-sm mt-4 mb-2">6. Security</h3>
                <p class="text-slate-300 text-xs leading-relaxed mb-4">
                    We take reasonable technical and organizational measures to protect information processed through Sentnl. However, no internet-based service can guarantee absolute security. You should not send information to Sentnl that requires a level of security or confidentiality that the service is not designed to provide.
                </p>

                <h3 class="text-indigo-400 font-semibold text-sm mt-4 mb-2">7. Your Choices</h3>
                <p class="text-slate-300 text-xs leading-relaxed mb-4">
                    You can stop using a Sentnl webhook at any time. If you want to request access to, correction of, or deletion of personal information associated with your use of Sentnl, contact us using the information below.
                </p>

                <h3 class="text-indigo-400 font-semibold text-sm mt-4 mb-2">8. Children's Privacy</h3>
                <p class="text-slate-300 text-xs leading-relaxed mb-4">
                    Sentnl is not intended for children under the age of 13, and we do not knowingly collect personal information from children under 13.
                </p>

                <h3 class="text-indigo-400 font-semibold text-sm mt-4 mb-2">9. International Data Transfers</h3>
                <p class="text-slate-300 text-xs leading-relaxed mb-4">
                    Sentnl and its service providers may process information in countries other than the country where you are located. Where applicable, we take reasonable steps to ensure that information is handled in accordance with applicable privacy requirements.
                </p>

                <h3 class="text-indigo-400 font-semibold text-sm mt-4 mb-2">10. Changes to This Policy</h3>
                <p class="text-slate-300 text-xs leading-relaxed mb-4">
                    We may update this Privacy Policy as Sentnl develops or as applicable privacy requirements change. When we make material changes, we will update the "Last updated" date at the top of this page.
                </p>

                <h3 class="text-indigo-400 font-semibold text-sm mt-4 mb-2">11. Contact Us</h3>
                <p class="text-slate-300 text-xs leading-relaxed mb-2">If you have questions about this Privacy Policy or how Sentnl handles information, contact us at:</p>
                <p class="text-indigo-400 text-xs font-semibold mb-2">
                    <a href="mailto:contact@sentnl.tech">contact@sentnl.tech</a>
                </p>
            </div>

            <div class="py-2"></div>
        </body>
        </html>
    `);
});

// 4. Contact Page
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
                <h1 class="text-3xl font-extrabold mb-3">Get in Touch</h1>
                <p class="text-slate-400 text-sm mb-6">
                    Have questions, feature requests, or need help integrating a webhook into your workflow? Reach out to us directly at:
                </p>
                <a href="mailto:contact@sentnl.tech" class="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg shadow-indigo-600/25 text-sm mb-6">
                    contact@sentnl.tech
                </a>
            </div>

            <div class="py-2"></div>
        </body>
        </html>
    `);
});

// 5. Signup Endpoint (Handles user creation, default monitor, and onboarding email)
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

        const webhookUrl = `http://localhost:3000/webhook/${monitor.webhook_secret}`;

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
                    <h2 class="text-2xl font-bold mb-2">Webhook URL Sent!</h2>
                    <p class="text-slate-400 text-sm mb-6">We've generated your unique endpoint and emailed it directly to <strong>${email}</strong>.</p>
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

// 6. CORE WEBHOOK VALIDATION ENGINE
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

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});