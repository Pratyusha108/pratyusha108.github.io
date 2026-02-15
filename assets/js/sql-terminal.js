(function () {
  'use strict';

  var sqlInput = document.getElementById('sql-input');
  var terminalOutput = document.getElementById('terminal-output');
  var terminalBody = document.getElementById('terminal-body');

  if (!sqlInput || !terminalOutput) return;

  // Mock database
  var db = {
    skills: [
      { name: 'Python', category: 'Programming', proficiency: 92, years: 4 },
      { name: 'SQL', category: 'Database', proficiency: 90, years: 4 },
      { name: 'Machine Learning', category: 'AI/ML', proficiency: 90, years: 3 },
      { name: 'Power BI', category: 'Visualization', proficiency: 88, years: 3 },
      { name: 'R', category: 'Programming', proficiency: 85, years: 3 },
      { name: 'Deep Learning', category: 'AI/ML', proficiency: 82, years: 2 },
      { name: 'TensorFlow', category: 'Framework', proficiency: 80, years: 2 },
      { name: 'Azure ML', category: 'Cloud', proficiency: 80, years: 2 },
      { name: 'NLP', category: 'AI/ML', proficiency: 78, years: 2 },
      { name: 'Tableau', category: 'Visualization', proficiency: 78, years: 2 },
      { name: 'PyTorch', category: 'Framework', proficiency: 75, years: 2 },
      { name: 'Pandas', category: 'Library', proficiency: 92, years: 4 },
      { name: 'Scikit-learn', category: 'Library', proficiency: 88, years: 3 }
    ],
    projects: [
      { id: 1, name: 'Direct Mail Response Analytics', domain: 'Machine Learning', tech: 'R, Logistic Regression', year: 2025, auc: 0.902 },
      { id: 2, name: 'Smartphone Resale Pricing', domain: 'Machine Learning', tech: 'R, Regression', year: 2025, auc: 0.87 },
      { id: 3, name: 'Time Series Forecasting Portfolio', domain: 'Time Series', tech: 'R, ETS, TBATS', year: 2025, auc: null },
      { id: 4, name: 'Sentiment Analysis Pipeline', domain: 'Deep Learning/NLP', tech: 'Python, BERT', year: 2024, auc: 0.91 },
      { id: 5, name: 'Customer Segmentation', domain: 'Analytics/BI', tech: 'Python, K-Means', year: 2024, auc: null },
      { id: 6, name: 'Power BI Ninja Warriors Dashboard', domain: 'Analytics/BI', tech: 'Power BI, DAX', year: 2024, auc: null },
      { id: 7, name: 'Image Classification CNN', domain: 'Computer Vision', tech: 'Python, TensorFlow', year: 2024, auc: 0.94 },
      { id: 8, name: 'Fraud Detection System', domain: 'Machine Learning', tech: 'Python, XGBoost', year: 2024, auc: 0.88 },
      { id: 9, name: 'Sales Performance Dashboard', domain: 'Analytics/BI', tech: 'Tableau', year: 2023, auc: null },
      { id: 10, name: 'IoT Access Control Analytics', domain: 'Machine Learning', tech: 'C, Python', year: 2019, auc: null }
    ],
    experience: [
      { role: 'Graduate Research Assistant', company: 'Osmania University', start_year: 2022, end_year: 2022, type: 'Research' },
      { role: 'Data Analyst', company: 'Independent Engagements', start_year: 2021, end_year: 2022, type: 'Analytics' },
      { role: 'Data Analyst Intern (IoT)', company: 'Smart Bridge - IBM', start_year: 2019, end_year: 2019, type: 'Internship' }
    ],
    education: [
      { degree: 'M.S. Data Analytics', institution: 'Webster University', year: 2026, gpa: null },
      { degree: 'MBA Technology Management', institution: 'Osmania University', year: 2022, gpa: null },
      { degree: 'B.Tech EEE', institution: 'Osmania University', year: 2020, gpa: null }
    ],
    certifications: [
      { name: 'Azure Data Scientist Associate (DP-100)', issuer: 'Microsoft', year: 2026 },
      { name: 'Python for Data Science & ML Bootcamp', issuer: 'Udemy', year: 2024 },
      { name: 'Java Full Stack Development', issuer: 'Sathya Technologies', year: 2023 },
      { name: 'Research Skills: Statistical Tests', issuer: 'HCDC', year: 2023 },
      { name: 'Embedded Systems for IoT', issuer: 'Smart Bridge (IBM)', year: 2019 }
    ]
  };

  var tableSchemas = {
    skills: ['name', 'category', 'proficiency', 'years'],
    projects: ['id', 'name', 'domain', 'tech', 'year', 'auc'],
    experience: ['role', 'company', 'start_year', 'end_year', 'type'],
    education: ['degree', 'institution', 'year', 'gpa'],
    certifications: ['name', 'issuer', 'year']
  };

  function addOutput(text, cls) {
    var line = document.createElement('div');
    line.className = 'terminal-line' + (cls ? ' ' + cls : '');
    line.textContent = text;
    terminalOutput.appendChild(line);
    if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function addOutputHTML(html) {
    var line = document.createElement('div');
    line.className = 'terminal-table';
    line.innerHTML = html;
    terminalOutput.appendChild(line);
    if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function formatTable(rows, columns) {
    if (rows.length === 0) return '(0 rows returned)';

    var widths = {};
    columns.forEach(function (col) {
      widths[col] = col.length;
    });
    rows.forEach(function (row) {
      columns.forEach(function (col) {
        var val = String(row[col] === null || row[col] === undefined ? 'NULL' : row[col]);
        if (val.length > widths[col]) widths[col] = Math.min(val.length, 30);
      });
    });

    var sep = '+' + columns.map(function (c) { return '-'.repeat(widths[c] + 2); }).join('+') + '+';
    var header = '|' + columns.map(function (c) {
      return ' ' + c.toUpperCase() + ' '.repeat(Math.max(0, widths[c] - c.length)) + ' ';
    }).join('|') + '|';

    var lines = [sep, header, sep];
    rows.forEach(function (row) {
      var line = '|' + columns.map(function (c) {
        var val = String(row[c] === null || row[c] === undefined ? 'NULL' : row[c]);
        if (val.length > 30) val = val.substring(0, 27) + '...';
        return ' ' + val + ' '.repeat(Math.max(0, widths[c] - val.length)) + ' ';
      }).join('|') + '|';
      lines.push(line);
    });
    lines.push(sep);
    lines.push('(' + rows.length + ' row' + (rows.length !== 1 ? 's' : '') + ')');

    return lines.join('\n');
  }

  function applyWhere(data, rest) {
    var whereMatch = rest.match(/WHERE\s+(\w+)\s*(=|!=|>|<|LIKE)\s*'?([^']*?)'?(\s|$)/i);
    if (whereMatch) {
      var col = whereMatch[1].toLowerCase();
      var op = whereMatch[2].toUpperCase();
      var val = whereMatch[3];

      data = data.filter(function (row) {
        var rowVal = row[col];
        if (rowVal === null || rowVal === undefined) return false;

        if (op === '=') {
          if (typeof rowVal === 'number') return rowVal === parseFloat(val);
          return String(rowVal).toLowerCase() === val.toLowerCase();
        }
        if (op === '!=') {
          if (typeof rowVal === 'number') return rowVal !== parseFloat(val);
          return String(rowVal).toLowerCase() !== val.toLowerCase();
        }
        if (op === '>') return parseFloat(rowVal) > parseFloat(val);
        if (op === '<') return parseFloat(rowVal) < parseFloat(val);
        if (op === 'LIKE') {
          var pattern = val.replace(/%/g, '.*').replace(/_/g, '.');
          return new RegExp('^' + pattern + '$', 'i').test(String(rowVal));
        }
        return true;
      });
    }
    return data;
  }

  function executeQuery(query) {
    var q = query.trim();
    addOutput('portfolio_db> ' + q, 'command');

    var upper = q.toUpperCase().replace(/\s+/g, ' ').trim();

    if (upper === 'CLEAR' || upper === 'CLS') {
      terminalOutput.innerHTML = '';
      return;
    }

    if (upper === 'HELP') {
      addOutput('Available commands:', 'info');
      addOutput('  SHOW TABLES          - List all tables', 'info');
      addOutput('  DESCRIBE <table>     - Show table schema', 'info');
      addOutput('  SELECT * FROM <table>          - Get all rows', 'info');
      addOutput('  SELECT * FROM <table> WHERE <col> = <val>', 'info');
      addOutput('  SELECT * FROM <table> ORDER BY <col> [ASC|DESC]', 'info');
      addOutput('  SELECT * FROM <table> LIMIT <n>', 'info');
      addOutput('  SELECT COUNT(*) FROM <table>', 'info');
      addOutput('  CLEAR                - Clear terminal', 'info');
      addOutput('', '');
      addOutput('Supported operators: =, !=, >, <, LIKE', 'info');
      addOutput('Tables: skills, projects, experience, education, certifications', 'info');
      return;
    }

    if (upper === 'SHOW TABLES') {
      var tables = Object.keys(db);
      addOutput(formatTable(
        tables.map(function (t) { return { table_name: t, rows: db[t].length }; }),
        ['table_name', 'rows']
      ));
      return;
    }

    var descMatch = upper.match(/^DESCRIBE\s+(\w+)$/);
    if (descMatch) {
      var tbl = descMatch[1].toLowerCase();
      if (!db[tbl]) {
        addOutput("Error: Table '" + tbl + "' does not exist. Use SHOW TABLES.", 'error');
        return;
      }
      var schema = tableSchemas[tbl];
      var schemaRows = schema.map(function (col) {
        var sample = db[tbl][0] ? db[tbl][0][col] : null;
        var type = typeof sample === 'number' ? (Number.isInteger(sample) ? 'INTEGER' : 'FLOAT') : 'TEXT';
        return { column_name: col, type: type };
      });
      addOutput(formatTable(schemaRows, ['column_name', 'type']));
      return;
    }

    var countMatch = upper.match(/^SELECT\s+COUNT\s*\(\s*\*\s*\)\s+FROM\s+(\w+)(.*)$/);
    if (countMatch) {
      var tbl = countMatch[1].toLowerCase();
      if (!db[tbl]) {
        addOutput("Error: Table '" + tbl + "' does not exist.", 'error');
        return;
      }
      var data = applyWhere(db[tbl], countMatch[2]);
      if (data === null) return;
      addOutput(formatTable([{ count: data.length }], ['count']));
      return;
    }

    var selectMatch = upper.match(/^SELECT\s+(.+?)\s+FROM\s+(\w+)(.*)$/);
    if (selectMatch) {
      var colsPart = selectMatch[1].trim();
      var tbl = selectMatch[2].toLowerCase();
      var rest = selectMatch[3] || '';

      if (!db[tbl]) {
        addOutput("Error: Table '" + tbl + "' does not exist. Use SHOW TABLES.", 'error');
        return;
      }

      var data = db[tbl].slice();
      var columns = tableSchemas[tbl];

      if (colsPart !== '*') {
        var requestedCols = colsPart.toLowerCase().split(',').map(function (c) { return c.trim(); });
        var validCols = requestedCols.filter(function (c) { return columns.indexOf(c) !== -1; });
        if (validCols.length === 0) {
          addOutput("Error: No valid columns found. Available: " + columns.join(', '), 'error');
          return;
        }
        columns = validCols;
      }

      data = applyWhere(data, rest);
      if (data === null) return;

      var orderMatch = rest.match(/ORDER\s+BY\s+(\w+)(\s+(ASC|DESC))?/i);
      if (orderMatch) {
        var orderCol = orderMatch[1].toLowerCase();
        var orderDir = (orderMatch[3] || 'ASC').toUpperCase();
        data.sort(function (a, b) {
          var av = a[orderCol], bv = b[orderCol];
          if (av === null || av === undefined) return 1;
          if (bv === null || bv === undefined) return -1;
          if (typeof av === 'number' && typeof bv === 'number') {
            return orderDir === 'ASC' ? av - bv : bv - av;
          }
          var cmp = String(av).localeCompare(String(bv));
          return orderDir === 'ASC' ? cmp : -cmp;
        });
      }

      var limitMatch = rest.match(/LIMIT\s+(\d+)/i);
      if (limitMatch) {
        data = data.slice(0, parseInt(limitMatch[1]));
      }

      var filteredData = data.map(function (row) {
        var r = {};
        columns.forEach(function (c) { r[c] = row[c]; });
        return r;
      });

      addOutput(formatTable(filteredData, columns));
      return;
    }

    addOutput("Error: Unrecognized query. Type HELP for available commands.", 'error');
  }

  sqlInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      var query = sqlInput.value.trim();
      if (query) {
        executeQuery(query);
        sqlInput.value = '';
      }
    }
  });

  if (terminalBody) {
    terminalBody.addEventListener('click', function () {
      sqlInput.focus();
    });
  }

  var sqlChips = document.querySelectorAll('.sql-chip');
  sqlChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var query = chip.getAttribute('data-query');
      if (query) {
        executeQuery(query);
      }
    });
  });
})();
