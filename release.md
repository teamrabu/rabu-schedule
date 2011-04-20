Rabu Schedule Release Checklist
===============================

1. Update CHANGELOG (and README, if necessary)
2. `rake release shutdown`
3. Commit
4. Remove '.dev' from README
5. Commit with 'Release X.Y.Z' as commit message
6. `git tag "release-X.Y.Z"
7. `git push`
8. `git push --tags`
9. Increment version number in README and add '.dev'
10. Commit with message 'Started X.Y.Z' (use new version number)
11. Announce to mailing list

Mailing list announcement template
---

Subject: Rabu Schedule X.Y.Z released

Rabu Schedule X.Y.Z has been released. You can download it from https://github.com/teamrabu/rabu-schedule .

Changes:
[Paste in changelog]