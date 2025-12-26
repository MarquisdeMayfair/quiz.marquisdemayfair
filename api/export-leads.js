// Vercel Serverless Function - Export Leads as CSV
// Password-protected endpoint for admin access

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check admin password
  const password = req.headers['x-admin-password'] || req.query.password;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ error: 'Admin password not configured' });
  }

  if (password !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Get all lead IDs
    const leadIds = await kv.lrange('leads:all', 0, -1);
    
    if (!leadIds || leadIds.length === 0) {
      return res.status(200).json({ 
        message: 'No leads found',
        count: 0 
      });
    }

    // Fetch all leads
    const leads = [];
    for (const id of leadIds) {
      const lead = await kv.get(id);
      if (lead) {
        leads.push(lead);
      }
    }

    // Check if JSON or CSV format requested
    const format = req.query.format || 'csv';

    if (format === 'json') {
      return res.status(200).json({
        count: leads.length,
        leads: leads
      });
    }

    // Generate CSV
    const headers = [
      'Email',
      'First Name',
      'Primary Archetype',
      'Secondary Archetype',
      'Opt In',
      'Date',
      'Dominance',
      'Submission',
      'Sadism',
      'Masochism',
      'Rigger',
      'Rope Bottom',
      'Exhibitionist',
      'Voyeur',
      'Primal Hunter',
      'Primal Prey',
      'Owner',
      'Property',
      'Caregiver',
      'Dependent',
      'Switch',
      'Service'
    ];

    const csvRows = [headers.join(',')];

    for (const lead of leads) {
      const scores = lead.scores || {};
      const row = [
        `"${lead.email}"`,
        `"${lead.firstName || ''}"`,
        `"${lead.archetype || ''}"`,
        `"${lead.secondaryArchetype || ''}"`,
        lead.optIn ? 'Yes' : 'No',
        `"${lead.createdAt || ''}"`,
        scores.dominance || 0,
        scores.submission || 0,
        scores.sadism || 0,
        scores.masochism || 0,
        scores.rigger || 0,
        scores.rope_bottom || 0,
        scores.exhibitionist || 0,
        scores.voyeur || 0,
        scores.primal_hunter || 0,
        scores.primal_prey || 0,
        scores.owner || 0,
        scores.property || 0,
        scores.caregiver || 0,
        scores.dependent || 0,
        scores.switch || 0,
        scores.service || 0
      ];
      csvRows.push(row.join(','));
    }

    const csv = csvRows.join('\n');

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=marquis-leads-${new Date().toISOString().split('T')[0]}.csv`);
    
    return res.status(200).send(csv);

  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({ error: 'Export failed' });
  }
}

