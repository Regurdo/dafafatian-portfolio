// @ts-nocheck
'use client';

import { useState } from 'react';
import { Certificate } from '@/lib/supabase';
import { fallbackCertificates } from '@/lib/data';
import Folder from '@/components/reactbits/Folder';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export default function Certificates() {
  const [certificates] = useState<Certificate[]>(fallbackCertificates);
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  const folderItems = certificates.map(cert => ({
    content: (
      <div className="cert-doc">
        <span className="cert-doc-badge">CERTIFIED</span>
        <span className="cert-doc-title">{cert.title}</span>
        <span className="cert-doc-issuer">{cert.issuer}</span>
        <span className="cert-doc-line" style={{ width: '92%' }} />
        <span className="cert-doc-line" style={{ width: '78%' }} />
        <span className="cert-doc-line" style={{ width: '85%' }} />
        <span className="cert-doc-date">{formatDate(cert.issue_date)}</span>
      </div>
    ),
  }));

  return (
    <section id="certificates" className="certificates-section">
      <div className="certificates-inner">
        <div className="certificates-copy">
          <p className="section-tag">/ 05 — credentials</p>
          <h2 className="section-title">
            Certificates &amp;<br />
            <span className="title-accent">Achievements</span>
          </h2>
          <p className="certificates-description">
            Every course I finished and every exam I passed lives in this folder. Open it up, drag a certificate out,
            or click one to take a closer look.
          </p>

          {activeCert && (
            <div className="cert-detail">
              <span className="cert-detail-title">{activeCert.title}</span>
              <span className="cert-detail-issuer">{activeCert.issuer}</span>
              <span className="cert-detail-date">Issued {formatDate(activeCert.issue_date)}</span>
              {activeCert.description && <p className="cert-detail-desc">{activeCert.description}</p>}
              {activeCert.credential_url && (
                <a
                  className="cert-detail-link"
                  href={activeCert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View credential ↗
                </a>
              )}
            </div>
          )}
        </div>

        <div className="certificates-folder">
          <Folder
            label="Certificates"
            items={folderItems}
            mode="flap"
            variant="solid"
            color="#3d8bff"
            layout="spread"
            size={1.35}
            tilt={0.35}
            onItemClick={item => {
              const index = folderItems.indexOf(item);
              setActiveCert(index >= 0 ? certificates[index] : null);
            }}
          />
          <p className="certificates-hint">Click the folder to open · drag certificates out · click one to zoom</p>
        </div>
      </div>
    </section>
  );
}
